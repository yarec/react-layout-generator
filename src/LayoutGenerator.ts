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
  next: () => IRect | undefined ;
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

  state: () => IRect | undefined;

  constructor(props: LayoutGeneratorProps) {
    this.props = props;
    this.origin = props.origin;
    this.scale = props.scale;
    this.state = this.init;
    this.layoutCounter = 0;
  }

  update = (origin: IPoint, scale: IPoint) => {
    this.origin = origin;
    this.scale = scale;
  }

  reset = () => {
    this.state = this.init;   
    this.layoutCounter = 0;
  }

  init = (): IRect | undefined => {
    return this.nextBlock();
  }

  nextBlock = (): IRect | undefined => {
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

  nextTile = (): IRect | undefined => {
    let r: IRect | undefined = undefined;
    if (this.layout) {
      r = this.blockTemplate.translate({
        x: this.origin.x + this.layout.location.x + this.colCounter * this.layout.blockSize.x,
        y: this.origin.y + this.layout.location.y + this.rowCounter * this.layout.blockSize.y
      });

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
      r.top *= this.scale.y;
      r.left *= this.scale.x;
      r.bottom *= this.scale.y;
      r.right *= this.scale.x;
    }

    return r;
  }

  next = (): IRect | undefined => {
    return this.state();
  }
}

export interface IGridGenerator {
  cols: number;
  rows: number;
  blockSize: IPoint;
}

// export class LayoutGenerators {
//   layouts: Array<LayoutGenerator> = [];
//   layout: LayoutGenerator;

//   nextLayout = () => {
//     return this.layout.next();
//   }

//   next = (): IRect | undefined => {
//     return this.layout.next();
//   }
// }

export function centerLayout(
  width: number, 
  g: LayoutGenerator
  ): LayoutGenerator {

  g.reset();
  let o: IPoint = {x: Infinity, y: -Infinity};
  let r: IRect | undefined = g.next();
  while (r) {
    if (r.left < o.x) {
      o.x = r.left;
    }
    if (r.right > o.y) {
      o.y = r.right;
    }
    r = g.next();
  }

  let origin = g.origin;
  let scale = g.scale;

  const layoutW2 = (o.y - o.x) / 2;
  const containerW2 = width / 2; 

  if (containerW2 - layoutW2 > 0) {
    origin.x = containerW2 - layoutW2;
  }

  console.log ('centerLayout', origin.x, scale.x);
  g.update(origin, scale);
  g.reset();

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
    origin: {x: 0, y: 0},
    scale: {x: 1, y: 1},
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
    blockSize: {x: args.blockSize.x * headerSize, y: args.blockSize.y}
  };
  const layout = {
    name: 'mobileGrid',
    location: { x: 0, y: args.blockSize.y },
    rows: args.rows,
    cols: args.cols,
    blockSize: args.blockSize
  };
  const props: LayoutGeneratorProps = {
    origin: {x: 0, y: 0},
    scale: {x: 1, y: 1},
    layouts: [header, layout]
  };
  return new LayoutGenerator(props);
}
