import { height, IRect, translate, width, IPoint, IPosition, OriginX, OriginY } from './types';
// import { string } from 'prop-types';
// import { number } from 'prop-types';
// import { reduceRight } from 'async';

type FValue = (p: Params) => number | IRect | IPoint | IPosition;
export type Value = number | IRect | IPoint | IPosition | FValue;

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

  get(key: string) {
    const r = this.params.get(key);
    // if (!r) {
    //   return NaN;
    // }
    // if (0 && typeof r === 'object') {
    //   const result = r[0];
    //   if (!result) {
    //     return NaN;
    //   }
    //   return result;
    // }
    return r;
  }

  set(key: string, v: Value) {
    const r = this.params.get(key);
    if (r != v) {
      this.changeCount += 1;
      // console.log('Param.set ', key, v)
      this.params.set(key, v);
    }
  }
}

// export function EvalCell(cell: Value, p: Params) {
//   if (typeof cell === 'function') {
//     return cell(p);
//   }
//   return cell;
// }

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

export enum PositionRef {
  rect = 1,
  height_top,
  height_bottom,
  width_left,
  width_right,
  point_left_top,
  point_right_top,
  point_left_bottom,
  point_right_bottom
};


export interface IEdit {
  positionRef: PositionRef;
  variable: string;
  update: (v: Value, ref: PositionRef, deltaX: number, deltaY: number, params: Params) => Value;
}

export interface ILayout {
  name: string;
  location: IRect; // relative to origin
  editSize?: Array<IEdit>;
  editVisiblity?: boolean;
  style?: React.CSSProperties;
  g?: ILayoutGenerator;
}

// export interface LayoutGeneratorArgs {
//   origin: IPoint;
//   scale: IPoint;
//   layouts: Map<string, ILayout>;
//   params: Params;
// }

export interface ILayoutGenerator {
  name: () => string;
  params: () => Params;
  reset: () => void;
  next: () => ILayout | undefined;
  lookup: (name: string) => ILayout | undefined;
  create?: (name: string, position: IPosition) => ILayout | undefined;
  api: () => API | undefined;
}

export class ResizeLayout implements ILayoutGenerator {
  private _name: string;
  g: ILayoutGenerator;
  origin: IPoint;
  scale: IPoint;

  constructor(name: string, g: ILayoutGenerator, origin: IPoint, scale: IPoint) {
    this._name = name;
    this.g = g;
    this.origin = origin;
    this.scale = scale;
  }

  name = () => {
    return this._name;
  }

  params = () => {
    return this.g.params();
  }

  api = () => {
    return this.g.api();
  }

  protected transform = (b: ILayout | undefined) => {
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

  next = (): ILayout | undefined => {
    return this.transform(this.g.next());
  }

  reset = () => {
    this.g.reset();
  }

  lookup = (name: string): ILayout | undefined => {
    return this.transform(this.g.lookup(name));
  };

  // layout = (name: string): ILayout | undefined => {
  //   return this.g.layout(name);
  // };
}

export type IInit = (params: Params, layouts?: Map<string, ILayout>) => Map<string, ILayout>;
export type ICreate = (name: string, params: Params, layouts: Map<string, ILayout>, position: IPosition) => ILayout;
export default class BasicLayoutGenerator implements ILayoutGenerator {
  private _name: string;
  private _params: Params;
  private _api: API | undefined;
  private _init: IInit;
  private _create: ICreate | undefined;
  layouts: Map<string, ILayout>;
  layoutsIterator: IterableIterator<ILayout>;
  currentLayout: ILayout | undefined;

  state: () => ILayout | undefined;

  constructor(name: string, init: IInit, params: Params, create?: ICreate, api?: API) {
    this._name = name;
    this._init = init;
    this._create = create;
    this.layouts = init(params);
    this.layoutsIterator = this.layouts.values();
    this.state = this.init;
    this._params = params;
    this._api = api;
  }

  name = () => {
    return this._name;
  }

  params = () => {
    return this._params;
  }

  api = () => {
    return this._api;
  }

  lookup = (name: string): ILayout | undefined => {
    const parts = name.split('/');
    let r = this.layouts.get(parts[0]);
    if (r) {
      if (r.g) {
        let n = r.g.lookup(name);
        if (n) {
          return Object.assign({}, n);
        }
      }
      return Object.assign({}, r);
    }
    return undefined;
  }

  create = (name: string, position: IPosition) => {
    if (this._create) {
      return this._create(name, this._params, this.layouts, position);
    }
    return undefined;
  }

  reset = () => {
    if (this._params.changed()) {
      // console.log('reset update layouts')
      this.layouts = this._init(this._params, this.layouts); // unless external
    }
    this.state = this.init;
    this.layoutsIterator = this.layouts.values();
    this.layouts.forEach((item: ILayout) => {
      if (item.g) {
        item.g.reset();
      }
    })
  }

  init = (): ILayout | undefined => {
    return this.nextBlock();
  }

  private nextBlock = (): ILayout | undefined => {
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

  private nestedBlock = (): ILayout | undefined => {
    let b: ILayout | undefined = undefined;
    if (this.currentLayout && this.currentLayout.g) {
      b = this.currentLayout.g.next();
    }
    if (b === undefined) {
      this.state = this.nextBlock;
      return this.nextBlock();
    }
    return b;
  }

  private nextTile = (): ILayout | undefined => {
    let b: ILayout | undefined = undefined;
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

  next = (): ILayout | undefined => {
    return this.state();
  }
}

// interface INestedGenerator {
//   next: () => ILayout | undefined;
//   init: (name: string, location: Location, params: Params) => void;
//   lookup: (part: string) => ILayout | undefined;
// }

export class GridGenerator implements ILayoutGenerator {
  _name: string;
  _params: Params;
  _api: API;
  state: () => ILayout | undefined;
  block: ILayout;
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

  name = () => {
    return this._name;
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

  nextTile = (): ILayout | undefined => {
    let r: ILayout | undefined = undefined;
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

  next = (): ILayout | undefined => {
    return this.state();
  }
}

export function DesktopLayout(name: string) {

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

  function init(params: Params, layouts?: Map<string, ILayout>): Map<string, ILayout> {
    const width = params.get('width') as number;
    const height = params.get('height') as number;
    const fullWidthHeaders = params.get('fullWidthHeaders') as number;
    let leftSideWidth = params.get('leftSideWidth') as number;
    let rightSideWidth = params.get('rightSideWidth') as number;
    const headerHeight = params.get('headerHeight') as number;
    const footerHeight = params.get('footerHeight') as number;

    // console.log( 'get Rect top', params.get('rect', 'top'));
    // console.log( 'get Rect xxx', params.get('rect', 'xxx'));
    // console.log( 'get Rect', params.get('rect'));
    // console.log( 'get Rect 2', params.get('rect') + 1);

    if (width < 800) {
      leftSideWidth = 0;
      rightSideWidth = 0;
    }


    // console.log('rightSideWidth', rightSideWidth)

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
      //  console.log('leftSide', location);
      return {
        name: 'leftSide',
        editSize: [{ positionRef: PositionRef.width_right, variable: 'leftSideWidth', update: widthUpdate }],
        location: location
      }
    }();

    const rightSide = function (): ILayout {
      let location: IRect;

      if (fullWidthHeaders) {
        location = {
          left: width - rightSideWidth,
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
      // console.log('rightSide', location);
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
      // console.log('header', location);
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
      // console.log('content', location);
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
      //console.log('footer', location);
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

  return new BasicLayoutGenerator(name, init, params);
}

// Value of key name is an IRect
// returns the value to set in Params
export function rectUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number): Value {
  const vr = v as IRect;
  console.log('rectUpdate ', deltaX, deltaY, v)
  return {
    top: vr.top + deltaY,
    left: vr.left + deltaX,
    bottom: vr.bottom + deltaY,
    right: vr.right + deltaX
  }
}

export function rectWidthUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number): Value {
  const vr = v as IRect;
  const width = vr.right - vr.left;
  return {
    top: vr.top,
    left: vr.left,
    bottom: vr.bottom,
    right: vr.left + width + deltaX
  }
}

export function rectHeightUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number): Value {
  const vr = v as IRect;
  const height = vr.bottom - vr.top;
  return {
    top: vr.top,
    left: vr.left,
    bottom: vr.top + height + deltaY,
    right: vr.right
  }
}

export function widthUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number): Value {
  const width = v as number;
  return width + deltaX;
}

export function positionUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number, params: Params): Value {
  const width = params.get('width') as number;
  const height = params.get('height') as number;

  const vr = v as IPosition;

  const x = vr.position.x + deltaX;
  const y = vr.position.y + deltaY;

  return {
    origin: vr.origin,
    position: {
      x: x,
      y: y
    },
    def: {
      x: width,
      y: height
    },
    size: vr.size
  }
}

export function positionWidthUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number, params: Params): Value {

  const vr = v as IPosition;
  return {
    origin: vr.origin,
    position: vr.position,
    def: vr.def,
    size: {
      x: vr.size.x + deltaX,
      y: vr.size.y
    }
  }
}

export function positionHeightUpdate(v: Value, ref: PositionRef, deltaX: number, deltaY: number, params: Params): Value {

  const vr = v as IPosition;
  return {
    origin: vr.origin,
    position: vr.position,
    def: vr.def,
    size: {
      x: vr.size.x,
      y: vr.size.y + deltaY
    }
  }
}


export function DiagramLayout(name: string) {

  function computePosition(position: IPosition, width: number, height: number): IRect {
    let x = 0;
    let y = 0;
    switch (position.origin.x) {
      case OriginX.None: {
        x = position.position.x;
        break; 
      }
      case OriginX.Left: {
        x = 0 + position.position.x * width / position.def!.x;
        break;
      }
      case OriginX.Q1: {
        x = width / 4 + position.position.x * width / position.def!.x;
        break;  
      }
      case OriginX.Center: {
        x = width / 2 + position.position.x * width / position.def!.x;
        break;
      }
      case OriginX.Q3: {
        x = 3 * width / 4 + position.position.x * width / position.def!.x;
        break;  
      }
      case OriginX.Right: {
        x = width + position.position.x * width / position.def!.x;
        break;
      }
      default: {
        console.error(`computePosition: Illegal value of position.origin.x`, position.origin.x);
      }
    }
    switch (position.origin.y) {
      case OriginY.None: {
        y = position.position.y;
        break; 
      }
      case OriginY.Top: {
        y = 0 + position.position.y *  height / position.def!.y;
        break;
      }
      case OriginY.Q1: {
        y = height / 4 + position.position.y * height / position.def!.y;
        break;
      }
      case OriginY.Center: {
        y = height / 2 + position.position.y * height / position.def!.y;
        break;
      }
      case OriginY.Q3: {
        y = 3 * height / 4 + position.position.y * height / position.def!.y;
        break;
      }
      case OriginY.Bottom: {
        y = height + position.position.y * height / position.def!.y;
        break;
      }
      default: {
        console.error(`computePosition: Illegal value of position.origin.y`, position.origin.y);
      }
    }

    return {
      top: y,
      left: x,
      bottom: y + position.size.y,
      right: x + position.size.x
    }
  }
  const params = new Params([
    ['width', 0],
    ['height', 0]
  ])

  function init(params: Params, layouts?: Map<string, ILayout>): Map<string, ILayout> {
    const width = params.get('width') as number;
    const height = params.get('height') as number;

    if (!layouts) {
      const l: Map<string, ILayout> = new Map();
      return l;
    } 
    else {
      layouts.forEach((layout) => {
        let p = params.get(layout.name) as IPosition;
        if (p) {
          // console.log('init ' + layout.name + ' params', p)
          layout.location = computePosition(p, width, height);
          layouts.set(layout.name, layout);
        }
      });
    }
    return layouts;
  }

  function create(name: string, params: Params, layouts: Map<string, ILayout>, position: IPosition): ILayout {
    const width = params.get('width') as number;
    const height = params.get('height') as number;

    position.def = {
      x: width,
      y: height
    }

    const box = {
      name: name,
      editSize: [
        { positionRef: PositionRef.rect, variable: name, update: positionUpdate },
        { positionRef: PositionRef.width_right, variable: name, update: positionWidthUpdate },
        { positionRef: PositionRef.height_bottom, variable: name, update: positionHeightUpdate }
      ],
      location: computePosition(position, width, height)
    }
    layouts.set(box.name, box);
    params.set(name, position);
    return box;
  }

  return new BasicLayoutGenerator(name, init, params, create);
}

export function fitLayout(
  width: number,
  g: ILayoutGenerator
): ILayoutGenerator {

  g.reset();
  let o: IPoint = { x: +Infinity, y: -Infinity };
  let r: ILayout | undefined = g.next();
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
  return new ResizeLayout('resize.' + g.name(), g, origin, { x: scale, y: scale });
}

export function mobileDashboard(name: 'mobile.layout') {
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

  function init(params: Params, layouts?: Map<string, ILayout>): Map<string, ILayout> {
    const width = params.get('width') as number;
    const cols = params.get('cols') as number;
    const rows = params.get('rows') as number;

    const blockSize: IPoint = {
      x: width / cols,
      y: width / cols
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

  return new BasicLayoutGenerator(name, init, params);
}