export interface Props {
  [key: string]: any
}

/**
 * IAnimateProps configures an animation.
 */
export interface IAnimateProps {
  /**
   * Switch to stop start animation
   */
  active: boolean
  /**
   * The number of milliseconds between frames. A value of
   * zero will let the animation run continuously.
   */
  throttleTime?: number
}

/**
 * This defines the overflow property that are passed to css.
 * The options have the same meaning as the css overflow options.
 * These options only apply to RLGLayout.
 *
 * This property specifies whether to clip content or to add
 * scrollbars when an element's content is too big to fit in a
 * specified area.
 *
 * The default is visible.
 */
export enum OverflowOptions {
  /**
   * The overflow is not clipped. It renders outside the element's box. This is default.
   */
  visible = 0,
  /**
   * The overflow is clipped, and the rest of the content will be invisible.
   */
  hidden,
  /**
   * The overflow is clipped, but a scroll-bar is added to see the rest of the content.
   */
  scroll,
  /**
   * If overflow is clipped, a scroll-bar should be added to see the rest of the content.
   */
  auto
}

/**
 * IOrigin specifies the position within an element that location
 * uses to position the element. What this says is that if you place
 * a block at (10,10) then it is the origin that is placed at (10,10).
 * For example all the blocks below are placed at (100,100):
 *
 *  ┌───────────────────────────────┐
 *  │  A: origin: (x: 0, y: 0)      │
 *  │                               │
 *  │                               │
 *  │              o───────┐        │
 *  │              │       │        │
 *  │              │       │        │
 *  │              │       │        │
 *  │              └───────┘        │
 *  │                               │
 *  │                               │
 *  └───────────────────────────────┘
 *
 *  ┌───────────────────────────────┐
 *  │  B: origin: (x: 100, y: 0)    │
 *  │                               │
 *  │                               │
 *  │      ┌───────o                │
 *  │      │       │                │
 *  │      │       │                │
 *  │      │       │                │
 *  │      └───────┘                │
 *  │                               │
 *  │                               │
 *  └───────────────────────────────┘
 *
 *  ┌───────────────────────────────┐
 *  │   C: origin: (x: 50, y: 50)   │
 *  │          ┌───────┐            │
 *  │          │       │            │
 *  │          │   o   │            │
 *  │          │       │            │
 *  │          └───────┘            │
 *  │                               │
 *  │                               │
 *  │                               │
 *  │                               │
 *  └───────────────────────────────┘
 *
 * IOrigin is expressed in percent of the width and height of
 * an element. An origin of (0, 0) specifies the left top
 * position of the element. An origin of (50,50) specifies
 * the center of the element.
 *
 * Generally origins are between 0 and 100 for each axis, but values
 * outside of the 0 to 100 range are allowed. (This will also be useful
 * when other tranformations are used other than just x and y.
 *
 *  ```
 * origin: (x: 0, y: 0) - left top, the default
 *     o───────┐
 *     │       │
 *     └───────┘
 *
 * origin: {X: 100, y: 100} - right bottom
 *     ┌───────┐
 *     │       │
 *     └───────o
 *
 * origin: (x: 100, y: 0) - right top
 *     ┌───────o
 *     │       │
 *     └───────┘
 *
 *  origin: (x: 50, y: 50) - center center
 *     ┌───────┐
 *     │   o   │
 *     └───────┘
 *
 *  origin: (x: -20, y: 50) - (-20) center, outside of block
 *     ┌───────┐
 *  o  │       │
 *     └───────┘
 *
 *```
 */
export interface IOrigin {
  x: number
  y: number
}

/**
 * Defines the units of location and size passed to data-layout or
 * in [IPosition](iposition.html). Most computation will be done in pixels.
 */
export enum Unit {
  /**
   * Pixels (px) are relative to the viewing device. For low-dpi
   * devices, 1px is one device pixel (dot) of the display. For
   * printers and high resolution screens 1px implies multiple
   * device pixels.
   */
  pixel = 1, // px
  /**
   * Percent is relative to the parent size. That means that
   * if the parent size is rectangular the value will be proportional
   * to the parent size. In other words a perfect square will
   * be displayed as a rectangular element.
   */
  percent, // %
  /**
   * Preserve is similar percent except that it takes the shorter
   * axis to define the value of a 1% pixel and then applies that
   * to the other axis. This means that a perfect square will still
   * be presented as a square. Preserve is also similar to css's vw,
   * vh, vmin, and vmax units.
   */
  preserve, // %p
  /**
   * PreserveWidth is same as Preserve except that horizontal axis is
   * taken as the basis.
   */
  preserveWidth, // %pw
  /**
   * PreserveHeight is same as Preserve except that Vertical axis is
   * taken as the basis.
   */
  preserveHeight, // %ph

  // Keep unmanaged at the end of the list

  /**
   * Unmanaged is only usable for the size of an element. The actual
   * value is the natural size of the content as determined by the browser.
   *
   * Unmanaged applies to both width and height.
   */
  unmanaged, // a
  /**
   * UnmanagedWidth is the same as Unmanaged except it only applies to the
   * width.
   */
  unmanagedWidth, // aw
  /**
   * UnmanagedHeight is the same as Unmanaged except it only applies to the
   * height.
   */
  unmanagedHeight // ah
}

/**
 * isUnitUnmanaged returns true if the unit is one of the Unmanaged options.
 * @param unit
 */
export function isUnmanaged(unit: Unit | undefined) {
  return unit ? unit >= Unit.unmanaged : false
}

/**
 * unitFactor returns the multiplication factor of 100 to convert to/from percent. Otherwise it returns 1.
 * @param unit
 */
export function unitFactor(unit: Unit | undefined) {
  let factor = 1
  if (
    unit &&
    (Unit.percent || Unit.preserve || Unit.preserveHeight || Unit.preserveWidth)
  ) {
    factor = 100
  }
  return factor
}

/**
 * stringToUnit parses a string for an unit.
 * @param data
 */
export function stringToUnit(data: string) {
  const d = data.trim()
  switch (d.charAt(d.length - 1)) {
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
      switch (d.charAt(d.length - 2)) {
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
      switch (d.charAt(d.length - 2)) {
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

/**
 * namedUnit returns a printable name of a unit.
 * @param unit
 */
export function namedUnit(unit: Unit | undefined) {
  let name = 'unknown'
  switch (unit) {
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

/**
 * PositionRef defines the location of 'drag' handle on an element's location and size.
 * Drag handles provide a space where a user may point and hold to change its location.
 */
export enum PositionRef {
  /** There is no drag handle which means that an element cannot be edited.*/
  none = 0,
  /** The drag handle is the rect of the element. */
  position,
  /** The drag handle is the top of the rect. */
  top,
  /** The drag handle is the bottom of the rect. */
  bottom,
  /** The drag handle is the left of the rect. */
  left,
  /** The drag handle is the right of the rect. */
  right,
  /** The drag handle is the left top of the rect. */
  leftTop,
  /** The drag handle is the right top of the rect. */
  rightTop,
  /** The drag handle is the left bottom of the rect. */
  leftBottom,
  /** The drag handle is the right bottom of the rect. */
  rightBottom
}

/**
 * namedPositionRef returns a printable name for a ref.
 * @param ref
 */
export function namedPositionRef(ref: PositionRef) {
  let name = 'unknown'
  switch (ref) {
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

/**
 * Defines debug options that write to the console when enabled.
 */
export enum DebugOptions {
  /**
   * No debug output will be written to the console except
   * for critical errors which will throw. This is the default.
   */
  none = 0,
  /**
   * Only general information will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  info = 1 << 0,
  /**
   * Only a warnings will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  warning = 1 << 1,
  /**
   * Critical errors are alway written the console. This option adds non-critical errors.
   */
  // tslint:disable-next-line:no-bitwise
  error = 1 << 2,
  /**
   * Only instrumented trace information will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  trace = 1 << 3,
  /**
   * Only frame timing will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  timing = 1 << 4,
  /**
   * Params and Blocks values will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  data = 1 << 5,
  /**
   * Selected mouse events will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  mouseEvents = 1 << 6,
  /**
   * All instrumented logging will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  all = ~(~0 << 7)
}

/**
 * Allows multiple DebugOptions to be combined.
 */
export type DebugOptionsArray = DebugOptions[]

/** Enables optional services */
export enum ServiceOptions {
  /**
   * No services will be enabled. This is the default.
   */
  none = 0,
  /**
   * Enable editor
   */
  edit,
  /**
   * Enable drag and drop
   */
  dnd
}

/**
 * IRect specifies the data that defines a rect in terms of its location and size.
 */
export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * rectSize returns the size of a rect.
 * @param rect
 */
export function rectSize(rect: IRect): ISize {
  return { width: rect.width, height: rect.height }
}

/**
 * rectPoint returns the location of a rect.
 * @param rect
 */
export function rectPoint(rect: IRect): IPoint {
  return { x: rect.x, y: rect.y }
}

/**
 * IAttrRect defines a rect in terms of the left top and right bottom.
 */
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

/**
 * Rect defines a class of an IRect.
 */
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

  get rightTop(): IPoint {
    return { x: this.x + this.width, y: this.y }
  }

  get leftBottom(): IPoint {
    return { x: this.x, y: this.y + this.height }
  }

  get rightBottom(): IPoint {
    return { x: this.x + this.width, y: this.y + this.height }
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

/**
 * IPoint defines a point in its element's local reference.
 */
export interface IPoint {
  x: number
  y: number
}

/**
 * ISize defines the extent of a rectangle in {width, height}.
 */
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
