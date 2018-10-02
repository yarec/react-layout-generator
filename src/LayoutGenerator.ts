import { IRect, Rect, IPoint } from './types';

export interface ILayout {
  name: string;
  location: IPoint; // relative to origin
  rows: number;
  cols: number;
  blockSize: IPoint;
}

export interface LayoutGeneratorProps {
  origin: IPoint;
  scale: IPoint;
  layouts: Array<ILayout>;
}

export interface ILayoutGenerator {
  origin: IPoint;
  scale: IPoint;
  next: () => IBlock | undefined;
}

export interface IReset {
  scale: IPoint | undefined; 
  origin: IPoint | undefined;
}

export interface IBlock {
  name: string;
  location: IRect;
}

export default class LayoutGenerator implements ILayoutGenerator {

  props: LayoutGeneratorProps;

  origin: IPoint;
  scale: IPoint;

  layoutCounter: number;
  rowCounter: number;
  colCounter: number;
  blockTemplate: Rect;
  layout: ILayout | undefined;

  state: () => IBlock | undefined;

  constructor(props: LayoutGeneratorProps) {
    this.props = props;
    this.origin = props.origin;
    // this.scale = props.scale;
    this.state = this.init;
    this.layoutCounter = 0;
  }

  reset = (params: IReset) => {
    this.state = this.init;
    this.layoutCounter = 0;
    const r: IReset = { origin: this.origin, scale: this.scale };
    if (params.origin) {
      this.origin = params.origin;
    }
    if (params.scale) {
      this.scale = params.scale;
    }

    return r;
  }

  init = (): IBlock | undefined => {
    return this.nextBlock();
  }

  nextBlock = (): IBlock | undefined => {
    this.layout = this.props.layouts[this.layoutCounter++];
    if (this.layout) {
      this.rowCounter = 0;
      this.colCounter = 0;
      this.blockTemplate = new Rect({
        top: 0,
        left: 0,
        bottom: this.layout.blockSize.y,
        right: this.layout.blockSize.x
      });
      this.state = this.nextTile;
      return this.nextTile();
    } else {
      this.state = this.init;
      return undefined;
    }
  }

  nextTile = (): IBlock | undefined => {
    let r: IBlock | undefined = undefined;
    if (this.layout) {
      r = {
        name: `${this.layout.name}[${this.rowCounter},${this.colCounter}]`,
        location: this.blockTemplate.translate({
          x: this.origin.x + this.layout.location.x + this.colCounter * this.layout.blockSize.x,
          y: this.origin.y + this.layout.location.y + this.rowCounter * this.layout.blockSize.y
        })
      }

      // LOGGER.log(
      //   'LayoutGenerator',
      //   'LayoutGenerator nextTile',
      //   {
      //     'colCounter': this.colCounter,
      //     'rowCounter': this.rowCounter,
      //     'result': r
      //   });

      if (this.colCounter < (this.layout.cols - 1)) {
        this.colCounter += 1;
      } else if (this.rowCounter < (this.layout.rows - 1)) {
        this.colCounter = 0;
        this.rowCounter += 1;
      } else {
        this.state = this.nextBlock;
      }
    }

    if (r) {
      r.location.top *= this.scale.y;
      r.location.left *= this.scale.x;
      r.location.bottom *= this.scale.y;
      r.location.right *= this.scale.x;
    }

    return r;
  }

  next = (): IBlock | undefined => {
    return this.state();
  }
}

export interface IResponsiveLayoutGenerator {
  name: string;
  mobile: (width: number, generator: LayoutGenerator) => LayoutGenerator,
  mobileLandscape: LayoutGenerator,
  tablet: LayoutGenerator,
  tabletLandscape: LayoutGenerator,
  desktop: LayoutGenerator,
  wideDesktop: LayoutGenerator
}

export interface IGridGenerator {
  cols: number;
  rows: number;
  blockSize: IPoint;
}

export function fitLayout(
  width: number,
  g: LayoutGenerator
): LayoutGenerator {

  g.reset({origin: undefined, scale: {x: 1, y: 1}});
  let o: IPoint = { x: +Infinity, y: -Infinity };
  let r: IBlock | undefined = g.next();
  while (r) {
    // console.log ('fitLayout item rect: ', r);
    if (r.location.left < o.x) {
      o.x = r.location.left;
    }
    if (r.location.right > o.y) {
      o.y = r.location.right;
    }
    r = g.next();
  }

  let scale = width / (o.y - o.x);
  console.log('fitLayout', width, o.x, o.y, scale);
  g.reset({origin: undefined, scale: {x: scale, y: scale}});

  return g;
}

export function simpleGrid(args: IGridGenerator) {
  const layout = {
    name: 'simpleGrid',
    location: { x: 0, y: 0 },
    rows: args.rows,
    cols: args.cols,
    blockSize: args.blockSize
  };
  const props: LayoutGeneratorProps = {
    origin: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
    layouts: [layout]
  };
  return new LayoutGenerator(props);
}

export function mobileDashboard(args: IGridGenerator) {
  let headerSize = 2.5;
  if (args.cols === 1) {
    headerSize = 1;
  } else if (args.cols === 2) {
    headerSize = 2;
  }
  const xCenter = ((args.cols * args.blockSize.x) / 2) - (args.blockSize.x * headerSize / 2);
  const header = {
    name: 'mobileHeader',
    location: { x: xCenter, y: 0 },
    rows: 1,
    cols: 1,
    blockSize: { x: args.blockSize.x * headerSize, y: args.blockSize.y }
  };
  const layout = {
    name: 'mobileGrid',
    location: { x: 0, y: args.blockSize.y },
    rows: args.rows,
    cols: args.cols,
    blockSize: args.blockSize
  };
  const props: LayoutGeneratorProps = {
    origin: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
    layouts: [header, layout]
  };
  return new LayoutGenerator(props);
}

export function transition(from: LayoutGenerator, to: LayoutGenerator) {
  
}
