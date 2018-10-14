import { height, IRect, translate, width, IPoint } from './types';

type FValue = (p: Params) => any; // number | IRect | IPoint | FRect;
type Value = number | IRect | IPoint | FValue;
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

  get(key: string, v?: Value) {
    const r = this.params.get(key);
    if (r != undefined) {
      return EvalCell(r, this);
    }
    if (v) {
      return EvalCell(v, this);
    }
    return EvalCell(NaN, this);
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
  if (typeof cell === 'function') {
    return cell(p);
  }
  return cell;
}

export class API {
  params: Params;

  constructor(params: Params) {
    this.params = params;
  }

  hide(component: string) {

  }

  show(component: string) {

  }
}

export interface ILayout {
  name: string;
  location: IRect; // relative to origin
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
  api: () => API | undefined;
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

  api = () => {
    return this.g.api();
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

type IInit = (params: Params) => Map<string, ILayout>;
export default class BasicLayoutGenerator implements ILayoutGenerator {
  private _params: Params;
  private _api: API | undefined;
  private _init: IInit;
  layouts: Map<string, ILayout>;
  layoutsIterator: IterableIterator<ILayout>;
  currentLayout: ILayout | undefined;

  state: () => IBlock | undefined;

  constructor(init: (params: Params) => Map<string, ILayout>, params: Params, api?: API) {
    this._init = init;
    this.layouts = init(params);
    this.layoutsIterator = this.layouts.values();
    this.state = this.init;
    this._params = params;
    this._api = api;
  }

  params = () => {
    return this._params;
  }

  api = () => {
    return this._api;
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
        location: r.location
      }
    }
    return undefined;
  }

  reset = () => {
    if (this._params.changed()) {
      console.log('reset update layouts')
      this.layouts = this._init(this._params);
    }
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
      const r = this.currentLayout.location;
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

  _params: Params;
  _api: API;
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
      location: { left: 0, top: 0, right: blockSize.x, bottom: blockSize.y }
    }
    this.colCounter = 0;
    this.rowCounter = 0;

    this.state = this.nextTile;
    this._params = new Params([]);
  }

  params = () => {
    return this._params;
  }

  api = () => {
    return this._api;
  }


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

export function DesktopLayout() {

  const fullWidthHeaders = 0;
  const leftSideWidth = 200;
  const rightSideWidth = 0;
  const headerHeight = 24;
  const footerHeight = 24;

  const params = new Params([
    ['width', 0],
    ['height', 0],
    ['fullWidthHeaders', fullWidthHeaders],
    ['leftSideWidth', leftSideWidth],
    ['rightSideWidth', rightSideWidth],
    ['headerHeight', headerHeight],
    ['footerHeight', footerHeight]
  ])

  function init(params: Params): Map<string, ILayout> {
    const width = params.get('width');
    const height = params.get('height');
    const fullWidthHeaders = params.get('fullWidthHeaders');
    const leftSideWidth = params.get('leftSideWidth');
    const rightSideWidth = params.get('rightSideWidth');
    const headerHeight = params.get('headerHeight');
    const footerHeight = params.get('footerHeight');

    console.log('rightSideWidth', rightSideWidth)

    const leftSide = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: headerHeight,
          right: leftSideWidth,
          bottom: height - footerHeight
        }
      } else {
        location = {
          left: 0,
          top: 0,
          right: leftSideWidth,
          bottom: height
        }
      }
      console.log('leftSide', location);
      return {
        name: 'leftSide',
        location: location
      }
    }();

    const rightSide = function (): ILayout {
      let location: IRect;

      if (fullWidthHeaders) {
        location = {
          left:  width - rightSideWidth,
          top: headerHeight,
          right: width,
          bottom: height - footerHeight
        }
      } else {
        location = {
          left: width - rightSideWidth,
          top: 0,
          right: width,
          bottom: height
        }
      }
      console.log('rightSide', location);
      return {
        name: 'rightSide',
        location: location
      }
    }();

    const header = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: 0,
          right: width,
          bottom: headerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: 0,
          right: width,
          bottom: headerHeight
        }
      }
      console.log('header', location);
      return {
        name: 'header',
        location: location
      }
    }();

    const content = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: leftSideWidth,
          top: headerHeight,
          right: width - rightSideWidth,
          bottom: height - footerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: headerHeight,
          right: width - rightSideWidth,
          bottom: height - footerHeight
        }
      }
      console.log('content', location);
      return {
        name: 'content',
        location: location
      }
    }();

    const footer = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: height - footerHeight,
          right: width,
          bottom: height
        }
      } else {
        location = {
          left: leftSideWidth,
          top: height - footerHeight,
          right: width,
          bottom: height
        }
      }
      console.log('footer', location);
      return {
        name: 'footer',
        location: location
      }
    }();

    return new Map([
      [leftSide.name, leftSide],
      [rightSide.name, rightSide],
      [header.name, header],
      [content.name, content],
      [footer.name, footer]
    ])
  }

  return new BasicLayoutGenerator(init, params);
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

  let origin = { x: 0, y: 0 };
  let scale = width / (o.y - o.x);
  return new ResizeLayout(g, origin, { x: scale, y: scale });
}

export function mobileDashboard() {
  const width = 0;
  const height = 0;
  const headerWidth = 1.5;
  const cols = 2;
  const rows = 3;

  

  const params = new Params([
    ['width', width],
    ['height', height],
    ['cols', cols],
    ['rows', rows],
  ]);

  function init(params: Params): Map<string, ILayout> {
    const width = params.get('width');
    const cols = params.get('cols');
    const rows = params.get('rows');

    const blockSize: IPoint = {
      x: width/cols,
      y: width/cols
    };
    const xCenter = ((cols * blockSize.x) / 2) - (blockSize.x * headerWidth / 2);

    const header = function (): ILayout {
      return {
        name: 'mobileHeader',
        location: {
          left: xCenter,
          top: 0,
          right: blockSize.x * headerWidth,
          bottom: blockSize.y
        }
      }
    }();

    const grid = function (): ILayout {
      return {
        name: 'mobileGrid',
        location: {
          left: 0,
          top: blockSize.y,
          right: blockSize.x,
          bottom: blockSize.y
        },
        g: new GridGenerator('Mobile', cols, rows, blockSize)
      }
    }();

    return new Map([
      [header.name, header],
      [grid.name, grid]
    ]);
  }

  return new BasicLayoutGenerator(init, params);
}