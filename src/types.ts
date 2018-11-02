

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
  top: number = 0;
  left: number = 0;
  bottom: number = 0;
  right: number = 0;

  constructor(rect: IRect/* {top: number, left: number, bottom: number, right: number} */) {
    this.top = rect.top;
    this.left = rect.left;
    this.bottom = rect.bottom;
    this.right = rect.right;
  }

  width() {
    return this.right - this.left;
  }

  height() {
    return this.bottom - this.top;
  }

  translate(point: IPoint): IRect {
    return {
      top: this.top + point.y,
      left: this.left + point.x,
      bottom: this.bottom + point.y,
      right: this.right + point.x
    };
  }

  add(rect: IRect): IRect {
    return {
      top: this.top + rect.top,
      left: this.left + rect.left,
      bottom: this.bottom + rect.bottom,
      right: this.right + rect.right
    };
  }

  intersect(r: Rect): boolean {
    return !(r.left > this.right
      || r.right < this.left
      || r.top > this.bottom
      || r.bottom < this.top);
  }
}

export enum IAlign {
  topLeft = 1,
  topCenter,
  topRight,
  rightTop,
  rightCenter,
  rightBottom,
  bottomRight,
  bottomCenter,
  bottomLeft,
  leftBottom,
  leftCenter,
  leftTop
}

export enum IUnit {
  pixel = 1,
  percent
}

export enum IOrigin {
  leftTop = 1,
  center
}

export interface IPosition {
  units: { 
    origin: IOrigin, 
    location: IUnit, 
    size: IUnit 
  }
  align?: {
    key: string, 
    offset: IPoint, 
    source: IAlign, 
    self: IAlign
  } 
  location: IPoint; // in percent
  size: IPoint; // in absolute
}

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