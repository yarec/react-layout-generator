

export interface IRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export function translate(r: IRect, p: IPoint): IRect {
  return {
    top: r.top + p.y,
    left: r.left + p.x,
    bottom: r.bottom + p.y,
    right: r.right + p.x
  };
}

export function scale(r: IRect, p: IPoint): IRect {
  return {
    top: r.top * p.y,
    left: r.left * p.x,
    bottom: r.bottom * p.y,
    right: r.right * p.x
  };
}

export function width(r: IRect) {
  return r.right - r.left;
}

export function height(r: IRect) {
  return r.bottom - r.top;
}

export class Rect implements IRect {
  private _top: number = 0;
  private _left: number = 0;
  private _bottom: number = 0;
  private _right: number = 0;

  private _width: number = 0;
  private _height: number = 0;
  private _halfWidth: number = 0;
  private _halfHeight: number = 0;

  constructor(rect: IRect) {
    this.update(rect);
  }

  update(rect: IRect) {
    this._top = rect.top;
    this._left = rect.left;
    this._bottom = rect.bottom;
    this._right = rect.right;

    this._width = this._right - this._left;
    this._height = this._bottom - this._top;
    this._halfWidth =  this._width / 2;
    this._halfHeight = this._height / 2;
  }

  get top() {
    return this._top;
  }
  
  get left() {
    return this._left;
  }

  get bottom() {
    return this._bottom;
  }

  get right() {
    return this._right;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get halfWidth() {
    return this._halfWidth;
  }

  get halfHeight() {
    return this._halfHeight;
  }

  get location() {
    return {x: this._left, y: this._top};
  }

  get size() {
    return {x: this._width, y: this._height};
  }

  get leftTop() {
    return {x: this._left, y: this._top};
  }

  set size(s: IPoint) {

  }

  translate(point: IPoint): IRect {
    return {
      top: this._top + point.y,
      left: this._left + point.x,
      bottom: this._bottom + point.y,
      right: this._right + point.x
    };
  }

  add(rect: IRect): IRect {
    return {
      top: this._top + rect.top,
      left: this._left + rect.left,
      bottom: this._bottom + rect.bottom,
      right: this._right + rect.right
    };
  }

  intersect(r: Rect): boolean {
    return !(r._left > this._right
      || r._right < this._left
      || r._top > this._bottom
      || r._bottom < this._top);
  }
}

// export enum IAlign {
//   topLeft = 1,
//   topCenter,
//   topRight,
//   rightTop,
//   rightCenter,
//   rightBottom,
//   bottomRight,
//   bottomCenter,
//   bottomLeft,
//   leftBottom,
//   leftCenter,
//   leftTop
// }

// // export enum IUnit {
// //   pixel = 1,
// //   percent
// // }

// // export enum IOrigin {
// //   leftTop = 1,
// //   center
// // }

// export interface IPosition {
//   units: { 
//     origin: IOrigin, 
//     location: IUnit, 
//     size: IUnit 
//   }
//   align?: {
//     key: string, 
//     offset: IPoint, 
//     source: IAlign, 
//     self: IAlign
//   } 
//   location: IPoint; 
//   size: IPoint; 
// }

export interface IPoint {
  x: number;
  y: number;
}

export class Point implements IPoint {
  x: number = 0;
  y: number = 0;

  isEmpty = () => {
    return this.x === 0 && this.y === 0;
  }
}