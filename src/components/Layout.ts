import { IGenerator } from '../generators/Generator';
import { IPoint, ISize, Rect } from '../types';
import { clone } from '../utils';

export interface IAlign {
  x: number;
  y: number;
}

/**
 * Defines the units of location and size
 */
export enum IUnit {
  pixel = 1,
  percent
}

export interface IOrigin {
  x: number;
  y: number;
}

export enum PositionRef {
  position = 1,
  top,
  bottom,
  left,
  right,
  leftTop,
  rightTop,
  leftBottom,
  rightBottom
};

export interface IEdit {
  part: PositionRef,
  variable?: string
}

export interface IPosition {
  units: {
    origin: IOrigin,
    location: IUnit,
    size: IUnit
  }
  align?: {
    key: string | number,
    offset: IPoint,
    source: IAlign,
    self: IAlign
  },
  edit?: Array<IEdit>;
  location: IPoint;
  size: ISize;
}

/**
 * Defines the location and size using
 * specified origin and units. Supports edit handles
 * defined by IAlign (.eg left center, right bottom)
 */
export default class Layout {
  private _name: string;
  private _position: IPosition;
  private _changed: boolean;
  private _cached: Rect;
  private _g: IGenerator;

  constructor(name: string, p: IPosition, g: IGenerator) {
    this._name = name;
    this._position = p;
    this._cached = new Rect({ x: 0, y: 0, width: 0, height: 0 });
    this._changed = true;
    this._g = g;

    // Convert percents to decimal
    this._position.units.origin.x *= .01;
    this._position.units.origin.y *= .01;

    // Convert percents to decimal
    if (this._position.units.location === IUnit.percent) {
      this._position.location.x *= .01;
      this._position.location.y *= .01;
    }

    // Convert percents to decimal
    if (this._position.units.size === IUnit.percent) {
      this._position.size.width *= .01;
      this._position.size.height *= .01;
    }

    // Convert percents to decimal
    if (this._position.align) {
      this._position.align.source.x *= .01;
      this._position.align.source.y *= .01;
      this._position.align.self.x *= .01;
      this._position.align.self.y *= .01;
    }
  }

  private scale = (p: IPoint): IPoint => {
    const size = this._g.params().get('viewport') as ISize;
    return {
      x: p.x * size.width,
      y: p.y * size.height
    }
  }

  private inverseScale = (p: IPoint): IPoint => {
    const size = this._g.params().get('viewport') as ISize;
    return {
      x: (p.x / size.width),
      y: (p.y / size.height)
    }
  }

  private scaleSize = (p: ISize): ISize => {
    const size = this._g.params().get('viewport') as ISize;
    return {
      width: p.width * size.width,
      height: p.height * size.height
    }
  }

  private inverseScaleSize = (p: ISize): ISize => {
    const size = this._g.params().get('viewport') as ISize;
    return {
      width: (p.width / size.width),
      height: (p.height / size.height)
    }
  }

  /**
 * Defines the origin of location in percent
 * If the origin is (50,50) then the top left is
 * (p.x - .50 * s.x, p.y - .50 * s.y)
 * 
 *  x----------------
 *  |               |
 *  |       o       |
 *  |               |
 *  ----------------
 *  o: origin
 *  x: left top
 */
  private fromOrigin = (p: IPoint, s: ISize): IPoint => {
    return {
      x: p.x - this._position.units.origin.x * s.width,
      y: p.y - this._position.units.origin.y * s.height
    }
  }

  /**
   * reverses fromOrigin
   */
  private toOrigin = (p: IPoint, s: ISize): IPoint => {
    return {
      x: p.x + this._position.units.origin.x * s.width,
      y: p.y + this._position.units.origin.y * s.height
    }
  }

  /**
   * Compute left top point of rectangle based on align value
   * If p represents the bottom center point then the top left 
   * position is (p.x - s.x / 2, p.y - s.y;)
   * Inverse of toAlign. 
   */
  private fromAlign = (p: IPoint, s: ISize, align: IAlign): IPoint => {
    return {
      x: p.x - align.x * s.width,
      y: p.y - align.y * s.height
    }
  }

  /**
   * Gets the point of an handle given an origin and size
   * if align is left top then return (rect.left, rect.top)
   * if align if bottom center then return 
   * (r.left + r.halfWidth, r.bottom;)
   *  Inverse of fromAlign. 
   */
  private toAlign = (p: IPoint, s: ISize, align: IAlign): IPoint => {
    return {
      x: p.x + align.x * s.width,
      y: p.y + align.y * s.height
    }
  }

  clone = (): Layout => {
    const p = clone(this._position);
    return new Layout(this._name, p, this._g);
  }

  get name() {
    return this._name;
  }

  get edit() {
    return this._position.edit;
  }

  get generator() {
    return this._g;
  }

  /**
   * Converts location to pixels
   */
  fromLocation = (): IPoint => {
    // Handle align - ignore actual value of location
    if (this._position.align) {
      let ref = undefined;
      if (typeof this._position.align.key === 'string') {
        ref = this._g.lookup(this._position.align.key as string);
      } else {
        const l = this._g.layouts();
        if (l) {
          ref = l.find(this._position.align.key as number);
        }
      }
      if (ref) {
        const p: IPoint = ref.fromLocation();
        const s: ISize = ref.fromSize();
        const source: IPoint = this.toAlign(p, s, this._position.align.source);
        const offset: IPoint = { x: source.x + this._position.align.offset.x, y: source.y + this._position.align.offset.y }
        return this.fromAlign(offset, this.fromSize(), this._position.align.self);
      }
    }

    if (this._position.units.location === IUnit.percent) {
      const p = this.scale(this._position.location);
      return this.fromOrigin(p, this.fromSize());
    }
    return this.fromOrigin(this._position.location, this.fromSize());
  }

  /** 
   * Converts size to pixels
   */
  fromSize = () => {
    if (this._position.units.size === IUnit.percent) {
      return this.scaleSize(this._position.size);
    }
    return this._position.size;
  }

  rect = () => {
    if (this._changed) {
      this._changed = false;
      this._cached.update({ ...this.fromLocation(), ...this.fromSize() })
    }
    return {...this._cached.location, ...this._cached.size};
  }

  touch = () => {
    this._changed = true;
  }

  /**
   * Change the layout state
   */
  update = (location: IPoint, size: ISize) => {
    // Takes in world coordinates 
    // console.log(`Position update x: ${location.x} y: ${location.y}`)
    let p = this.toOrigin(location, size);

    if (this._position.units.location === IUnit.percent) {
      this._position.location = this.inverseScale(p);
    } else {
      this._position.location = p;
    }

    if (this._position.units.size === IUnit.percent) {
      this._position.size = this.inverseScaleSize(size);
    } else {
      this._position.size = size;
    }

    this._changed = true;
  }
}