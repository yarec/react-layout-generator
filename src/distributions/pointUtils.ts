import { Unit, IPoint } from '../types'
import {
  toUnit,
  IBounds,
  inverseXUnit,
  inverseYUnit,
  parseUnitValue
} from '../components/blockUtils'

/**
 * This interface defines an input point that can include [units](#Unit). 
 * 
 * The following example specifies a point at the center of the container:

 * ```
 *  const p = {
 *    x: '50%',
 *    y: '50%'
 *  }
 * ```

 */
export interface IExPoint {
  x: number | string
  y: number | string
}

export class ExPoint {
  private _x: number
  private _y: number
  private _xUnit: Unit
  private _yUnit: Unit

  constructor(point: IExPoint) {
    this.update(point)
  }

  public getPoint(bounds: IBounds): IPoint {
    return { x: this.getX(bounds), y: this.getY(bounds) }
  }

  public update(pt: IExPoint) {
    this.setX(pt.x)
    this.setY(pt.y)
  }

  private getX(bounds: IBounds) {
    let x = this._x
    if (this._xUnit) {
      return inverseXUnit(this._x, this._xUnit, bounds)
    }
    return x
  }

  private getY(bounds: IBounds) {
    let y = this._y
    if (this._yUnit) {
      return inverseYUnit(this._y, this._yUnit, bounds)
    }
    return y
  }

  private setX(v: number | string) {
    if (typeof v === 'string') {
      const unit = toUnit(v)
      if (unit) {
        this._x = parseUnitValue(v, unit)
        this._xUnit = unit
      }
    }
  }

  private setY(v: number | string) {
    if (typeof v === 'string') {
      const unit = toUnit(v)
      if (unit) {
        this._y = parseUnitValue(v, unit)
        this._yUnit = unit
      }
    }
  }
}
