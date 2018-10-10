import { height, IRect, translate, width, IPoint } from './types';

type FValue = (p: Params) => number;
type Value = number | FValue;
export class Params {
  params: Map<string, Value>;
  changeCount: number = 0;

  constructor(values: Array<[string, Value]>) {
    this.params = new Map(values);
  }

  changed(): boolean {
    const changed = this.changeCount != 0;
    this.changeCount = 0;
    return changed;
  }

  // define(key: string, v: number): number {
  //   this.params.set(key, v);
  //   return v;
  // }

  get(key: string, v: Value) {
    const r = this.params.get(key);
    if (r === undefined) {
      return EvalCell(v, this);
    }
    return EvalCell(r, this);
  }

  set(key: string, v: Value) {
    const r = this.params.get(key);
    if (r === undefined) {
      throw `variable ${key} not defined`;
    }
    if (EvalCell(r, this) != EvalCell(v, this)) {
      this.changeCount += 1;
      this.params.set(key, v);
    }
  }
}

export function EvalCell(cell: Value, p: Params) {
  if (typeof cell  === 'number') {
    return cell;
  }
  return cell(p);
}

export interface ILayout {
  name: string;
  location: (p: Params) => IRect; // relative to origin
  g?: ILayoutGenerator;
}

// export interface LayoutGeneratorArgs {
//   origin: IPoint;
//   scale: IPoint;
//   layouts: Map<string, ILayout>;
//   params: Params;
// }

export interface IBlock {
  name: string;
  location: IRect;
  css?: {
    [id: string]: string;
  }
}

export interface IDef {
  [key: string]: Object | IDef;
}

export interface ILayoutGenerator {
   params: () => Params;
   reset: () => void;
   next: () => IBlock | undefined;
   lookup: (name: string) => IBlock | undefined;
}

export class ResizeLayout implements ILayoutGenerator {
  g: ILayoutGenerator;
  origin: IPoint;
  scale: IPoint;

  constructor(g: ILayoutGenerator, origin: IPoint, scale: IPoint) {
    this.g = g;
    this.origin = origin;
    this.scale = scale;
  }

  params = () => {
    return this.g.params();
  }

  protected transform = (b: IBlock | undefined) => {
    if (b) {
      b.location.top += this.origin.y;
      b.location.left += this.origin.x;
      b.location.bottom += this.origin.y;
      b.location.right += this.origin.x;

      b.location.top *= this.scale.y;
      b.location.left *= this.scale.x;
      b.location.bottom *= this.scale.y;
      b.location.right *= this.scale.x;
    }
    return b;
  }

  next = (): IBlock | undefined => {
    return this.transform(this.g.next());
  }

  reset = () => {
    this.g.reset();
  }

  lookup = (name: string): IBlock | undefined => {
    return this.transform(this.g.lookup(name));
  };

  // layout = (name: string): ILayout | undefined => {
  //   return this.g.layout(name);
  // };
}

export default class BasicLayoutGenerator implements ILayoutGenerator {

  // params: Params;

  private xparams: Params;
  layouts: Map<string, ILayout>;
  layoutsIterator: IterableIterator<ILayout>;
  currentLayout: ILayout | undefined;

  state: () => IBlock | undefined;

  constructor(layouts: Map<string, ILayout>, params: Params) {
    this.layouts = layouts;
    this.layoutsIterator = layouts.values();
    this.state = this.init;
    this.xparams = params;
  }

  params = () => {
    return this.xparams;
  }

  lookup = (name: string): IBlock | undefined => {
    const parts = name.split('/');
    let r = this.layouts.get(parts[0]);
    if (r) {
      if (r.g) {
        let n = r.g.lookup(name);
        if (n) {
          return {
            name: name,
            location: n.location
          }
        }
      }
      return {
        name: name,
        location: r.location(this.params())
      } 
    }
    return undefined;
  }

  reset = () => {
    this.state = this.init;
    this.layoutsIterator = this.layouts.values();
    this.layouts.forEach((item: ILayout) => {
      if (item.g) {
        item.g.reset();
      }
    })
  }

  init = (): IBlock | undefined => {
    return this.nextBlock();
  }

  private nextBlock = (): IBlock | undefined => {
    this.currentLayout = this.layoutsIterator.next().value;
    if (this.currentLayout) {
      if (this.currentLayout.g) {
        this.state = this.nestedBlock;
        return this.nestedBlock();
      } else {
        this.state = this.nextTile;
        return this.nextTile();
      }

    } else {
      this.state = this.init;
      return undefined;
    }
  }

  private nestedBlock = (): IBlock | undefined => {
    let b: IBlock | undefined = undefined;
    if (this.currentLayout && this.currentLayout.g) {
      b = this.currentLayout.g.next();
    }
    if (b === undefined) {
      this.state = this.nextBlock;
      return this.nextBlock();
    }
    return b;
  }

  private nextTile = (): IBlock | undefined => {
    let b: IBlock | undefined = undefined;
    if (this.currentLayout) {
      const r = this.currentLayout.location(this.params());
      b = {
        name: this.currentLayout.name,
        location: r
      }
      this.state = this.nextBlock;
    }

    return b;
  }

  next = (): IBlock | undefined => {
    return this.state();
  }
}

// interface INestedGenerator {
//   next: () => IBlock | undefined;
//   init: (name: string, location: Location, params: Params) => void;
//   lookup: (part: string) => ILayout | undefined;
// }

export class GridGenerator implements ILayoutGenerator {

  xparams: Params;
  state: () => IBlock | undefined;
  block: IBlock;
  cols: number;
  rows: number;
  colCounter: number;
  rowCounter: number;

  constructor(name: string, cols: number, rows: number, blockSize: IPoint) {
    this.cols = cols;
    this.rows = rows;
    this.block = {
      name: name,
      location: {left: 0, top: 0, right: blockSize.x, bottom: blockSize.y}
    }
    this.colCounter = 0;
    this.rowCounter = 0;

    this.state = this.nextTile;
    this.xparams = new Params([]);
  }

  params = () => {return this.xparams}

  lookup = (name: string) => {

    return undefined;
  }

  reset = () => {
    this.colCounter = 0;
    this.rowCounter = 0;
  }

  nextTile = (): IBlock | undefined => {
    let r: IBlock | undefined = undefined;
    if (this.block) {
      r = {
        name: `${this.block.name}/${this.rowCounter},${this.colCounter}`,
        location: translate(this.block.location, {
          x: this.block.location.left + this.colCounter * width(this.block.location),
          y: this.block.location.top + this.rowCounter * height(this.block.location)
        })
      }

      if (this.colCounter < (this.cols - 1)) {
        this.colCounter += 1;
      } else if (this.rowCounter < (this.rows - 1)) {
        this.colCounter = 0;
        this.rowCounter += 1;
      } else {
        r = undefined;
      }
    }

    return r;
  }

  next = (): IBlock | undefined => {
    return this.state();
  }
}

export function DesktopLayout(width: number, height: number) {
  const sideRight = 200;
  const headerHeight = 18;
  const footerHeight = 18;

  const params = new Params([
    ['width', width],
    ['height', height],
    ['sideRight', sideRight],
    ['headerHeight', headerHeight],
    ['footerHeight', footerHeight]
  ])

  const side: ILayout = {
    name: 'side',
    location: (p: Params) => {
      return {
        left: 0,
        top: 0,
        right: p.get('sideRight', sideRight),
        bottom: p.get('height', height)
      }
    }
  };

  const header: ILayout = {
    name: 'header',
    location: (p: Params) => {
      return {
        left: p.get('sideRight', sideRight),
        top: 0,
        right: p.get('width', width),
        bottom: p.get('headerHeight', headerHeight)
      }
    }
  };

  const content: ILayout = {
    name: 'content',
    location: (p: Params) => {
      return {
        left: p.get('sideRight', sideRight),
        top: p.get('headerHeight', headerHeight),
        right: p.get('width', width),
        bottom: p.get('height', height) - p.get('footerHeight', footerHeight)
      }
    }
  }

  const footer = {
    name: 'footer',
    location: (p: Params) => {
      return {
        left: p.get('sideRight', sideRight),
        top: p.get('height', height) - p.get('footerHeight', footerHeight),
        right: p.get('width', width),
        bottom: p.get('height', height) - p.get('footerHeight', footerHeight)
      }
    }
  }

  const layouts = new Map([
    [side.name, side],
    [header.name, header],
    [content.name, content],
    [footer.name, footer]
  ])


  return new BasicLayoutGenerator(layouts, params);
}

export function fitLayout(
  width: number,
  g: ILayoutGenerator
): ILayoutGenerator {

  g.reset();
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

  let origin = {x: 0, y: 0};
  let scale = width / (o.y - o.x);
  return new ResizeLayout(g, origin, {x: scale, y: scale});
}

export function mobileDashboard( cols: number, rows: number, blockSize: IPoint) {

  const params = new Params([
    ['cols', cols],
    ['rows', rows],
    ['x', (p: Params) => { return ((cols * blockSize.x) / 2) - (blockSize.x * headerSize / 2);} ] 
  ]);

  let headerSize = 2.5;
  if (cols === 1) {
    headerSize = 1;
  } else if (cols === 2) {
    headerSize = 2;
  }
  const xCenter = ((cols * blockSize.x) / 2) - (blockSize.x * headerSize / 2);
  const header = {
    name: 'mobileHeader',
    location: (parms: Params): IRect => {return { left: xCenter, top: 0, right: blockSize.x * headerSize, bottom: blockSize.y }}
  };
  const layout = {
    name: 'mobileGrid',
    location:  (p: Params): IRect => {
      return { 
        left: p.get('xCenter', 0), 
        top: blockSize.y, 
        right: blockSize.x * 
        headerSize, 
        bottom: blockSize.y }},
    g: new GridGenerator('Mobile', 3, 4, {x: 100, y: 100})
  }
  const layouts = new Map([
    [header.name, header],
    [layout.name, layout]
  ]);


  return new BasicLayoutGenerator(layouts, params);
}