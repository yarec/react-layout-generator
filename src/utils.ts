import { IPoint, ISize, Unit } from './types'

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
  unit: Unit
  value: IPoint | ISize
}

export function toPixel(v: IValue, containersize: ISize): IPoint | ISize {
  switch (v.unit) {
    case Unit.pixel: {
      return v.value
    }
    case Unit.percent: {
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / 100) * containersize.width,
          y: (p.y / 100) * containersize.height
        }
      } else {
        const s = v.value as ISize
        return {
          width: (s.width / 100) * containersize.width,
          height: (s.height / 100) * containersize.height
        }
      }
    }
    case Unit.vmin: {
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
          width: (s.width / 100) * factor,
          height: (s.height / 100) * factor
        }
      }
    }
    case Unit.vw: {
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
          width: (s.width / 100) * factor,
          height: (s.height / 100) * factor
        }
      }
    }
    case Unit.vh: {
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
          width: (s.width / 100) * factor,
          height: (s.height / 100) * factor
        }
      }
    }
    case Unit.unmanaged:
    case Unit.unmanagedWidth:
    case Unit.unmanagedHeight: {
      return v.value
    }
  }
  return v.value
}

export function toPercent(v: IValue, containersize: ISize): IPoint | ISize {
  switch (v.unit) {
    case Unit.unmanaged:
    case Unit.unmanagedWidth:
    case Unit.unmanagedHeight:
    case Unit.pixel: {
      if ('x' in v.value) {
        const p = v.value as IPoint
        return {
          x: (p.x / containersize.width) * 100,
          y: (p.y / containersize.height) * 100
        }
      } else {
        const s = v.value as ISize
        return {
          width: (s.width / containersize.width) * 100,
          height: (s.height / containersize.height) * 100
        }
      }
    }
    case Unit.percent: {
      return v.value
    }
    case Unit.vmin: {
      return v.value
    }
    case Unit.vw: {
      return v.value
    }
    case Unit.vh: {
      return v.value
    }
  }
  return v.value
}

// export function add(v1: IValue, v2: IValue, containersize: ISize) {
//   const p1 = toPixel(v1, containersize)
//   const p2 = toPixel(v2, containersize)

//   if ('x' in p1 && 'x' in p2) {
//     return {
//       x: p1.x + p2.x,
//       y: p1.y + p2.y
//     }
//   }
//   if ('width' in p1 && 'width' in p2) {
//     return {
//       width: p1.width + p2.width,
//       height: p1.height + p2.height
//     }
//   }

//   return {
//     x: NaN,
//     y: NaN
//   }
// }
