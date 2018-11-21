

export type Opaque<K, T> = T & { __TYPE__: K };

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// export function translate(r: IRect, p: IPoint): IRect {
//   return {
//     y: r.y + p.y,
//     x: r.x + p.x,
//     width: r.width,
//     height: r.height
//   };
// }

// export function scale(r: IRect, p: IPoint): IRect {
//   return {
//     y: r.y * p.y,
//     x: r.x * p.x,
//     height: r.height * p.y,
//     width: r.width * p.x
//   };
// }

// export function width(r: IRect) {
//   return r.width;
// }

// export function height(r: IRect) {
//   return r.height;
// }

export class Rect implements IRect {
  public y: number = 0;
  public x: number = 0;
  public width: number = 0;
  public height: number = 0;

  // private _halfWidth: number = 0;
  // private _halfHeight: number = 0;

  constructor(rect: IRect) {
    this.update(rect);
  }

  public update(rect: IRect) {
    this.setLocation({x: rect.x, y: rect.y});
    this.setSize({width: rect.width, height: rect.height});
  }

  public setLocation(p: IPoint) {
    this.x = p.x;
    this.y = p.y;
  }

  set location(p: IPoint) {
    this.setLocation(p);
  }

  get location(): IPoint {
    return {x: this.x, y: this.y};
  }

  get size(): ISize {
    return {width: this.width, height: this.height};
  }

  set size(s: ISize) {
    this.setSize(s);
  }

  public setSize(s: ISize) {
    this.width = s.width;
    this.height = s.height;
    // this._halfWidth = s.width / 2;
    // this._halfHeight = s.height / 2;
  }

  get top() {
    return this.y;
  }
  
  get left() {
    return this.x;
  }

  get bottom() {
    return this.y + this.height;
  }

  get right() {
    return this.x + this.width;
  }

  // get halfWidth() {
  //   return this._halfWidth;
  // }

  // get halfHeight() {
  //   return this._halfHeight;
  // }

  get leftTop(): IPoint {
    return {x: this.x, y: this.y};
  }


  public translate(point: IPoint): IRect {
    return {
      y: this.y + point.y,
      x: this.x + point.x,
      height: this.height,
      width: this.width
    };
  }

  public add(rect: IRect): IRect {
    return {
      y: this.y + rect.y,
      x: this.x + rect.x,
      height: this.height + rect.height,
      width: this.width + rect.width
    };
  }

  // intersect(r: Rect): boolean {
  //   return !(r.x > this._right
  //     || r._right < this.x
  //     || r.y > this._bottom
  //     || r._bottom < this.y);
  // }
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

// tslint:disable-next-line:max-classes-per-file
export class Point implements IPoint {
  public x: number = 0;
  public y: number = 0;

  public isEmpty = () => {
    return this.x === 0 && this.y === 0;
  }
}