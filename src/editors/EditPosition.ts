import {IEditor} from './Editor';

export default class EditPosition implements IEditor{
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
  private _g: IGenerator;

  constructor(p: JSON, g: IGenerator) {
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
