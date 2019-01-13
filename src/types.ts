export enum OverflowOptions {
  visible = 0,
  hidden,
  scroll,
  auto
}

/**
 * IOrigin specifies the position within an element that location
 * uses to position the element. IOrigin is expressed in percent
 * of the width and height of an element. An origin of (0, 0)
 * specifies the left top position of the element. An origin of
 * (50,50) specifies the center of the element.
 */
export interface IOrigin {
  x: number
  y: number
}

/**
 * Defines the units of location and size
 */
export enum Unit {
  pixel = 1, // px
  percent, // %
  preserve, // %p
  preserveWidth, // %pw
  preserveHeight, // %ph

  // Keep unmanaged at the end of the list
  unmanaged, // a
  unmanagedWidth, // aw
  unmanagedHeight // ah
}
export function isUnmanaged(u: Unit) {
  return u >= Unit.unmanaged
}

export function stringToUnit(data: string) {
  switch (data.charAt(data.length - 1)) {
    case 'x': {
      return Unit.pixel
    }
    case '%': {
      return Unit.percent
    }
    case 'a': {
      return Unit.unmanaged
    }
    case 'h': {
      switch (data.charAt(data.length - 2)) {
        case 'p': {
          return Unit.preserveHeight
        }
        case 'a': {
          return Unit.unmanagedWidth
        }
      }
      break
    }
    case 'w': {
      switch (data.charAt(data.length - 2)) {
        case 'p': {
          return Unit.preserveWidth
        }
        case 'a': {
          return Unit.unmanagedWidth
        }
      }
      break
    }
  }
  return Unit.pixel
}

export function namedUnit(u: Unit) {
  let name = 'unknown'
  switch (u) {
    case Unit.pixel: {
      name = 'pixel'
      break
    }
    case Unit.percent: {
      name = 'percent'
      break
    }
    case Unit.preserve: {
      name = 'preserve'
      break
    }
    case Unit.preserveWidth: {
      name = 'preserveWidth'
      break
    }
    case Unit.preserveHeight: {
      name = 'preserveHeight'
      break
    }

    case Unit.unmanaged: {
      name = 'unmanaged'
      break
    }
    case Unit.unmanagedWidth: {
      name = 'unmanagedWidth'
      break
    }
    case Unit.unmanagedHeight: {
      name = 'unmanagedHeight'
      break
    }
  }
  return name
}

export interface IOrigin {
  x: number
  y: number
}

export enum PositionRef {
  none = 0,
  position,
  top,
  bottom,
  left,
  right,
  leftTop,
  rightTop,
  leftBottom,
  rightBottom
}

export function namedPositionRef(pos: PositionRef) {
  let name = 'unknown'
  switch (pos) {
    case PositionRef.position: {
      name = 'position'
      break
    }
    case PositionRef.top: {
      name = 'top'
      break
    }
    case PositionRef.bottom: {
      name = 'bottom'
      break
    }
    case PositionRef.left: {
      name = 'left'
      break
    }
    case PositionRef.right: {
      name = 'right'
      break
    }
    case PositionRef.leftTop: {
      name = 'leftTop'
      break
    }
    case PositionRef.rightTop: {
      name = 'rightTop'
      break
    }
    case PositionRef.leftBottom: {
      name = 'leftBottom'
      break
    }
    case PositionRef.rightBottom: {
      name = 'rightBottom'
      break
    }
  }
  return name
}

export enum DebugOptions {
  none = 0,
  // tslint:disable-next-line:no-bitwise
  info = 1 << 0,
  // tslint:disable-next-line:no-bitwise
  warning = 1 << 1,
  // tslint:disable-next-line:no-bitwise
  warningAll = ~(~0 << 1),
  // tslint:disable-next-line:no-bitwise
  error = 1 << 2,
  // tslint:disable-next-line:no-bitwise
  errorAll = ~(~0 << 2),
  // tslint:disable-next-line:no-bitwise
  trace = 1 << 3,
  // tslint:disable-next-line:no-bitwise
  traceAll = ~(~0 << 3),
  // tslint:disable-next-line:no-bitwise
  timing = 1 << 4,
  // tslint:disable-next-line:no-bitwise
  data = 1 << 5,
  // tslint:disable-next-line:no-bitwise
  mouseEvents = 1 << 6,
  // tslint:disable-next-line:no-bitwise
  all = ~(~0 << 7)
}

export type DebugOptionsArray = DebugOptions[]

export enum EditOptions {
  none = 0,
  all
}

// export type Opaque<K, T> = T & { __TYPE__: K }

export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

export function rectSize(rect: IRect): ISize {
  return { width: rect.width, height: rect.height }
}

export function rectPoint(rect: IRect): IPoint {
  return { x: rect.x, y: rect.y }
}

export interface IAttrRect {
  left: number
  top: number
  right: number
  bottom: number
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
  public y: number = 0
  public x: number = 0
  public width: number = 0
  public height: number = 0

  // private _halfWidth: number = 0;
  // private _halfHeight: number = 0;

  constructor(rect: IRect) {
    this.update(rect)
  }

  public update(rect: IRect) {
    this.setLocation({ x: rect.x, y: rect.y })
    this.setSize({ width: rect.width, height: rect.height })
  }

  public setLocation(p: IPoint) {
    this.x = p.x
    this.y = p.y
  }

  get data() {
    const r: IRect = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
    return r
  }

  set location(p: IPoint) {
    this.setLocation(p)
  }

  get location(): IPoint {
    return { x: this.x, y: this.y }
  }

  get size(): ISize {
    return { width: this.width, height: this.height }
  }

  set size(s: ISize) {
    this.setSize(s)
  }

  public setSize(s: ISize) {
    this.width = s.width
    this.height = s.height
    // this._halfWidth = s.width / 2;
    // this._halfHeight = s.height / 2;
  }

  get top() {
    return this.y
  }

  get left() {
    return this.x
  }

  get bottom() {
    return this.y + this.height
  }

  get right() {
    return this.x + this.width
  }

  // get halfWidth() {
  //   return this._halfWidth;
  // }

  // get halfHeight() {
  //   return this._halfHeight;
  // }

  get leftTop(): IPoint {
    return { x: this.x, y: this.y }
  }

  public translate(point: IPoint): IRect {
    return {
      y: this.y + point.y,
      x: this.x + point.x,
      height: this.height,
      width: this.width
    }
  }

  public add(rect: IRect): IRect {
    return {
      y: this.y + rect.y,
      x: this.x + rect.x,
      height: this.height + rect.height,
      width: this.width + rect.width
    }
  }

  // intersect(r: Rect): boolean {
  //   return !(r.x > this._right
  //     || r._right < this.x
  //     || r.y > this._bottom
  //     || r._bottom < this.y);
  // }
}

export interface IPoint {
  x: number
  y: number
}

export interface ISize {
  width: number
  height: number
}

export interface IArgsPoint {
  x: number | string
  y: number | string
}

export interface IArgsSize {
  width?: number | string
  height?: number | string
}

// tslint:disable-next-line:max-classes-per-file
export class Point implements IPoint {
  public x: number = 0
  public y: number = 0

  public isEmpty = () => {
    return this.x === 0 && this.y === 0
  }
}
