import { IPoint, IRect } from './types';
import { ILayoutGenerator } from './LayoutGenerator';

export class Values {
  values: Map<string, IValue>

  toJSON = (): Array<JSON> => {
    let obj = Object.create(null);
    this.values.forEach((value, key) => {
      obj[key] = value.toJSON();
    });

    return obj;
  }

  fromJSON = (value: Array<JSON>) => {
    this.values.forEach((v: any, k: string) => {
      let value: IValue = new Empty({});
      switch (k) {
        case 'RightWidth': {
          value = new RightWidth(JSON.parse(v))
          break;
        }
      }
      this.values.set(k, value)
    })
  }
}

export interface JSON {
  [key: string]: string | JSON;
}

export interface IValue {
  update?: (x: number, y: number) => void;
  rect?: (r: IRect, g: ILayoutGenerator) => IRect;
  number?: () => number;
  point?: () => IPoint;
  equal: (r: IValue) => boolean;
  clone: () => IValue;
  toJSON: () => JSON;
}

export class Empty implements IValue {
  constructor(json: {}) {
  }

  clone = (): IValue => {
    console.warn('Error empty object');
    return new Empty({});
  }

  toJSON = (): JSON => {
    return {
      'Empty': {
      }
    }
  }
}

export class Scalar implements IValue {
  v: number;

  constructor(json: { v: number }) {
    this.v = json.v;
  }

  number = () => {
    return this.v;
  }

  clone = (): IValue => {
    return new Scalar({ v: this.v });
  }

  toJSON = (): JSON => {
    return {
      'RightWidth': {
        'width': `${this.v}`
      }
    }
  }
}
 
}

export class RightWidth implements IValue {
  width: number;

  constructor(json: { width: number }) {
    this.width = json.width;
  }

  update = (x: number, y: number): void => {
  }

  rect = (initialRef: IRect, g: ILayoutGenerator): IRect => {
    const r = {
      left: initialRef.left,
      top: initialRef.top,
      right: initialRef.left + this.width,
      bottom: initialRef.bottom
    }
    return r;
  }

  clone = (): IValue => {
    return new RightWidth({ width: this.width });
  }

  toJSON = (): JSON => {
    return {
      'RightWidth': {
        'width': `${this.width}`
      }
    }
  }
}

export class LeftWidth implements IValue {
  width: number;

  constructor(json: { width: number }) {
    this.width = json.width;
  }

  update = (x: number, y: number): void => {
  }

  rect = (initialRef: IRect, g: ILayoutGenerator): IRect => {

    return initialRef;
  }

  clone = (): IValue => {
    return new LeftWidth({ width: this.width });
  }

  toJSON = () => {
    return {
      'LeftWidth': {
        'width': `${this.width}`
      }
    }
  }
}

/**
 * Defines the handle location of a rect in percent
 */
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

export default class Position implements IValue{
  private _units: {
    origin: IOrigin,
    location: IUnit,
    size: IUnit
  }
  private _align?: {
    key: string | number,
    offset: IPoint,
    source: IAlign,
    self: IAlign
  }
  private _location: IPoint;
  private _size: IPoint;

  // private _rect: Rect;

  // private _params: Params;
  private _g: ILayoutGenerator;

  constructor(p: JSON, g: ILayoutGenerator) {
    this._units = p.units;
    this._align = p.align;
    this._location = p.location;
    this._size = p.size;
    this._g = g;

    // Convert percents to decimal
    this._units.origin.x *= .01;
    this._units.origin.y *= .01;

     // Convert percents to decimal
    if (this._units.location === IUnit.percent) {
      this._location.x *= .01;
      this._location.y *= .01;
    }

     // Convert percents to decimal
    if (this._units.size === IUnit.percent) {
      this._size.x *= .01;
      this._size.y *= .01;
    }

     // Convert percents to decimal
    if (this._align) {
      this._align.source.x *= .01;
      this._align.source.y *= .01;
      this._align.self.x *= .01;
      this._align.self.y *= .01;
    }
  }

  private scale = (p: IPoint): IPoint => {
    const size = this._g.params().get('viewport') as IPoint;
    return {
      x: p.x * size.x,
      y: p.y * size.y
    }
  }

  private inverseScale = (p: IPoint): IPoint => {
    const size = this._g.params().get('viewport') as IPoint;
    return {
      x: (p.x / size.x),
      y: (p.y / size.y)
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
private fromOrigin = (p: IPoint, s: IPoint): IPoint => {
    return {
      x: p.x - this._units.origin.x * s.x,
      y: p.y - this._units.origin.y * s.y
    }
  }

  /**
   * reverses fromOrigin
   */
  private toOrigin = (p: IPoint, s: IPoint): IPoint => {
    return {
      x: p.x + this._units.origin.x * s.x,
      y: p.y + this._units.origin.y * s.y
    }
  }

  /**
   * Compute left top point of rectangle based on align value
   * If p represents the bottom center point then the top left 
   * position is (p.x - s.x / 2, p.y - s.y;)
   * Inverse of toAlign. 
   */
  private fromAlign = (p: IPoint, s: IPoint, align: IAlign): IPoint => {
    return {
      x: p.x - align.x * s.x,
      y: p.y - align.y * s.y
    }
  }

  /**
   * Gets the point of an handle given an origin and size
   * if align is left top then return (rect.left, rect.top)
   * if align if bottom center then return 
   * (r.left + r.halfWidth, r.bottom;)
   *  Inverse of fromAlign. 
   */
  private toAlign = (p: IPoint, s: IPoint, align: IAlign): IPoint => {
    return {
      x: p.x + align.x * s.x,
      y: p.y + align.y * s.y
    }
  }

  /**
   * Converts location to pixels
   */
  fromLocation = (): IPoint => {
    // Handle align - ignore actual value of location
    if (this._align) {
      let ref;
      if (typeof this._align.key === 'string') {
        ref = this._g.lookup(this._align.key as string);
      } else {
        const l = this._g.layouts();
        if (l) {
          ref = l.find(this._align.key as number);
        }
        // ref = this._g.find(this._align.key as number);
      }
      if (ref) {
        const p: IPoint = {x: ref.location.left, y: ref.location.top};
        const source: IPoint = this.toAlign(p, ref.location.size, this._align.source);
        const offset: IPoint = { x: source.x + this._align.offset.x, y: source.y + this._align.offset.y }
        return this.fromAlign(offset, this.fromSize(), this._align.self);
      }
    }
    
    if (this._units.location === IUnit.percent) {
       const p = this.scale(this._location);
       return this.fromOrigin(p, this.fromSize());
    }
    return this.fromOrigin(this._location, this.fromSize());
  }

  // /**
  //  * Inverse of fromLocation
  //  */
  // setLocation = (r: IRect) => {
  //   // v is in pixels with origin (0,0) - v is leftTop
  //   // 1) compute origin
  //   let vc = this.toOrigin(v;


  //   this._location = v;
  //   if (this._units.location === IUnit.percent) {
  //     this._location = this.inverseScale(v);
  //   }

  // }

  /** 
   * Converts size to pixels
   */
  fromSize = () => {
    if (this._units.size === IUnit.percent) {
      return this.scale(this._size);
    }
    return this._size;
  }

  // /** 
  //  * Inverse of fromSize
  //  */
  // setSize = (v: IPoint) => {
  //   this._size = v;
  //   if (this._units.size === IUnit.percent) {
  //     this._size = this.inverseScale(v);
  //   }
  // }

  /**
   * computes the rect given the position
   */
  rect = (): IRect => {
    let leftTop = this.fromLocation();
    let size = this.fromSize();

    return {
      top: leftTop.y,
      left: leftTop.x,
      bottom: leftTop.y + size.y,
      right:  leftTop.x + size.x
    }
  }

  update = (location: IPoint, size: IPoint) => {
    // Takes in world coordinates 
    // console.log(`Position update x: ${location.x} y: ${location.y}`)
    let p = this.toOrigin(location, size);

    if (this._units.location === IUnit.percent) {
      this._location = this.inverseScale(p);
    } else {
      this._location = p;
    }

    if (this._units.size === IUnit.percent) {
      this._size = this.inverseScale(size);
    } else {
      this._size = size;
    }
  }
}
