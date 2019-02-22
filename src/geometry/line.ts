import { IGenerator } from '../generators/Generator'
import { createExPoint } from './point'
import { IPoint } from '../types'

/**
 * Create a Line class from its factory createLine(g: IGenerator)
 * @param g
 *  An instance of the a generator for binding the Line class to its
 *  generator.
 * @returns constructor function that can be used with new to create
 * an instance of the Line class. The type of the class is
 * InstanceType(typeof <constructor function>).
 */
export function createLine(g: IGenerator) {
  const fnExPoint = createExPoint(g)
  type ExPoint = InstanceType<typeof fnExPoint>

  /**
   * The Line class represents a line in 2D space from a start point to an
   * end point.
   */
  return class Line {
    /* private */ _start: ExPoint
    /* private */ _end: ExPoint

    constructor(start: ExPoint, end: ExPoint) {
      this._start = start
      this._end = end
    }

    get start(): IPoint {
      return this._start.getPoint()
    }

    get end(): IPoint {
      return this._end.getPoint()
    }

    get length() {
      const pt1 = this.start
      const pt2 = this.end
      return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2))
    }

    point(d: number) {
      const pt1 = this.start
      const pt2 = this.end
      const dn = d / this.length
      return {
        x: (1 - dn) * pt1.x + dn * pt2.x,
        y: (1 - dn) * pt1.y + dn * pt2.y
      }
    }

    distance(x: number, y: number): number | undefined {
      const p0 = this._start.getPoint()
      const p1 = this._end.getPoint()

      // compute distance
      const d1 = (x - p0.x) / (p1.x - p0.x)
      const d2 = (y - p0.y) / (p1.y - p0.y)

      // if equal then compute distance and return
      return Math.abs(d1 - d2) < Number.EPSILON ? d1 * this.length : undefined
    }

    intersects(x: number, y: number): boolean {
      return this.distance(x, y) !== undefined
    }
  }
}
