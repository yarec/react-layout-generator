// import { IPoint } from '../types'
import { createLine } from './line'
import { IGenerator } from '../generators/Generator'

export function createPiecewise(g: IGenerator) {
  const Line = createLine(g)
  type Line = InstanceType<typeof Line>

  return class Piecewise {
    // exported class expression may not be private or protected.ts(4094)
    // see #17744
    _lines: Line[]
    _wrap: boolean | undefined
    _length: number

    constructor(lines: Line[], wrap?: boolean) {
      this._lines = lines
      this._wrap = wrap
      this._length = 0
    }

    get length(): number {
      if (this._length === 0) {
        let dist = 0
        this._lines.forEach(line => {
          dist += line.length
        })
        this._length = dist
      }

      return this._length
    }

    public point(d: number) {
      if (this._wrap) {
        d = d % this.length
      }
      if (d >= 0) {
        let dist = 0
        for (let i = 0; i < this._lines.length; i++) {
          const line = this._lines[i]
          if (d < dist + line.length) {
            return line.point(d - dist)
          }
          dist += line.length
        }
      } else {
        const line = this._lines[0]
        return line.point(d)
      }
      return undefined
    }

    distance(x: number, y: number): number | undefined {
      for (let i = 0; i < this._lines.length; i++) {
        const line = this._lines[i]
        const d = line.distance(x, y)
        if (d !== undefined) {
          return d
        }
      }
      return undefined
    }

    intersects(x: number, y: number): boolean {
      return this.distance(x, y) !== undefined
    }
  }
}
