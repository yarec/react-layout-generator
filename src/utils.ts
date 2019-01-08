import { IPoint, ISize, IUnit } from './types'

export function clone(aObject: any) {
  if (!aObject) {
    return aObject
  }

  const bObject = Array.isArray(aObject) ? [] : {}
  for (const k in aObject) {
    if (k) {
      const v = aObject[k]
      bObject[k] = typeof v === 'object' ? clone(v) : v
    }
  }
  return bObject
}

export interface IValue {
  unit: IUnit
  value: IPoint | ISize
}

export class PixelPoint {
  private _p: IPoint

  constructor(p: IPoint) {
    this._p = p
  }

  public toPercent(containersize: ISize) {
    return {
      x: this._p.x / containersize.width,
      y: this._p.y / containersize.height
    }
  }
}

export function toPixel(v: IValue, containersize: ISize): IPoint | ISize {
  switch (v.unit) {
    case IUnit.pixel: {
      return v.value
      break
    }
    case IUnit.percent: {
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / 100) * containersize.width,
          y: (p.y / 100) * containersize.height
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / 100) * containersize.width,
          y: (s.height / 100) * containersize.height
        }
      }
      break
    }
    case IUnit.preserve: {
      const factor =
        containersize.height < containersize.width
          ? containersize.height
          : containersize.width
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / 100) * factor,
          y: (p.y / 100) * factor
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / 100) * factor,
          y: (s.height / 100) * factor
        }
      }
      break
    }
    case IUnit.preserveWidth: {
      const factor = containersize.width
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / 100) * factor,
          y: (p.y / 100) * factor
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / 100) * factor,
          y: (s.height / 100) * factor
        }
      }
      break
    }
    case IUnit.preserveHeight: {
      const factor = containersize.height
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / 100) * factor,
          y: (p.y / 100) * factor
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / 100) * factor,
          y: (s.height / 100) * factor
        }
      }
      break
    }
    case IUnit.unmanaged:
    case IUnit.unmanagedWidth:
    case IUnit.unmanagedHeight: {
      return v.value
      break
    }
  }
  return v.value
}

export function toPercent(v: IValue, containersize: ISize): IPoint | ISize {
  switch (v.unit) {
    case IUnit.pixel: {
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / containersize.width) * 100,
          y: (p.y / containersize.height) * 100
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / containersize.width) * 100,
          y: (s.height / containersize.height) * 100
        }
      }
      break
    }
    case IUnit.percent: {
      return v.value
      break
    }
    case IUnit.preserve: {
      const factor =
        containersize.height < containersize.width
          ? containersize.height
          : containersize.width
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / factor) * 100,
          y: (p.y / factor) * 100
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / factor) * 100,
          y: (s.height / factor) * 100
        }
      }
      break
    }
    case IUnit.preserveWidth: {
      const factor = containersize.width
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / factor) * 100,
          y: (p.y / factor) * 100
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / factor) * 100,
          y: (s.height / factor) * 100
        }
      }
      break
    }
    case IUnit.preserveHeight: {
      const factor = containersize.height
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / factor) * 100,
          y: (p.y / factor) * 100
        }
      } else {
        const s = v.value as ISize
        return {
          x: (s.width / factor) * 100,
          y: (s.height / factor) * 100
        }
      }
      break
    }
    case IUnit.unmanaged:
    case IUnit.unmanagedWidth:
    case IUnit.unmanagedHeight: {
      return v.value
      break
    }
  }
  return v.value
}

export function add(v1: IValue, v2: IValue, containersize: ISize) {
  const p1 = toPixel(v1, containersize)
  const p2 = toPixel(v2, containersize)

  if ('x' in p1 && 'x' in p2) {
    return {
      x: p1.x + p2.x,
      y: p1.y + p2.y
    }
  }
  if ('width' in p1 && 'width' in p2) {
    return {
      width: p1.width + p2.width,
      height: p1.height + p2.height
    }
  }

  return {
    x: NaN,
    y: NaN
  }
}
