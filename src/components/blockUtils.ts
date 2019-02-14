import { IBlockRect, IInputRect } from './blockTypes'
import { ISize, IRect, Unit, IPoint, IOrigin } from '../types'

/**
 * returns the connect point for the given rect and origin in local
 * pixel coordinates.
 * @param r: IRect
 * @param origin: IOrigin
 */
export function connectPoint(r: IRect, origin: IOrigin) {
  return { x: r.x + r.width * origin.x, y: r.y + r.height * origin.y }
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
export function fromOrigin(p: IRect, origin: IPoint | undefined): IRect {
  if (origin) {
    return {
      x: p.x - origin.x * p.width,
      y: p.y - origin.y * p.height,
      width: p.width,
      height: p.height
    }
  }
  return p
}

/**
 * reverses fromOrigin
 */
export function toOrigin(p: IRect, origin: IPoint | undefined): IRect {
  if (origin) {
    return {
      x: p.x + origin.x * p.width,
      y: p.y + origin.y * p.height,
      width: p.width,
      height: p.height
    }
  }
  return p
}

export function isUnmanaged(blockRect: IBlockRect) {
  return (
    blockRect.widthUnit === Unit.unmanaged ||
    blockRect.heightUnit === Unit.unmanaged
  )
}

/**
 * Compute left top point based on origin and size.
 * If p represents the bottom center point then the top left
 * position is (p.x - s.x / 2, p.y - s.y;)
 * Inverse of toAlign.
 */
export function fromAlign(p: IRect, origin: IOrigin): IPoint {
  return {
    x: p.x - origin.x * p.width,
    y: p.y - origin.y * p.height
  }
}

/**
 * Gets the connect handle given an origin and size
 * Inverse of fromAlign.
 */
export function toAlign(p: IRect, origin: IOrigin): IPoint {
  return {
    x: p.x + origin.x * p.width,
    y: p.y + origin.y * p.height
  }
}

/**
 * IRLGBounds provides the local and viewport bounds. It is updated by Layout
 * on every render. Both are in pixel units. Local is used for computing the
 * layout of each [Block](#Block). Both local and viewport are used to
 * in converting units to pixels depending upon the unit specified.
 */
export interface IRLGBounds {
  /**
   * Container is the size of the containing block in pixels.
   */
  container: ISize
  /**
   * Viewport is the user's visible area of a web page. It does include
   * scrollbars. Be sure to set the \<meta\> tag in your web page for correct
   * layout.
   */
  viewport: ISize
}

/**
 * This function converts an [IInputRect](#IInputRect) to a
 * [IBlockRect](#IBlockRect) by converting fields with units to fields without
 * unit.
 *
 * @param arg: IInputRect
 */
export function convertInputBlockRect(arg: IInputRect): IBlockRect {
  const internal: IBlockRect = {}

  for (let k in arg) {
    if (arg.hasOwnProperty(k)) {
      const v: number | string | undefined = arg[k]
      if (v !== undefined) {
        if (typeof v === 'string') {
          const unit = toUnit(v)

          if (unit) {
            const value = parseFloat(v)
            if (unit === Unit.pixel || unit === Unit.unmanaged) {
              // Convert to decimal
              internal[k] = value
            } else {
              internal[k] = value * 0.01
            }
            internal[`${k}Unit`] = unit
          }
        } else {
          internal[k] = v
        }
      }
    }
  }

  return internal
}

/**
 * toUnit parses a string for an unit.
 * @param data
 */
export function toUnit(data: string) {
  const d = data.trim()
  switch (d.charAt(d.length - 1)) {
    case 'x': {
      if (d.charAt(d.length - 2) === 'p') {
        return Unit.pixel
      }
      if (d.charAt(d.length - 2) === 'a') {
        if (d.charAt(d.length - 4) === 'p') {
          return Unit.pmax
        }
        if (d.charAt(d.length - 4) === 'v') {
          return Unit.vmax
        }
      }
      break
    }
    case '%': {
      return Unit.percent
    }
    case 'n': {
      if (d.charAt(d.length - 4) === 'v') {
        return Unit.vmin
      }
      if (d.charAt(d.length - 4) === 'p') {
        return Unit.pmin
      }
      break
    }

    case 'h': {
      if (d.charAt(d.length - 2) === 'v') {
        return Unit.vh
      }
      if (d.charAt(d.length - 2) === 'p') {
        return Unit.ph
      }
      break
    }
    case 'w': {
      if (d.charAt(d.length - 2) === 'v') {
        return Unit.vw
      }
      if (d.charAt(d.length - 2) === 'p') {
        return Unit.pw
      }
      break
    }
    case 'u': {
      return Unit.unmanaged
    }
  }

  console.error(`data-layout: Unit ${d} not recognized`)
  return
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
    case Unit.pmin: {
      name = 'max(pw, ph)'
      break
    }
    case Unit.pmin: {
      name = 'min(pw, ph)'
      break
    }
    case Unit.pw: {
      name = '1% container width'
      break
    }
    case Unit.ph: {
      name = '1% container height'
      break
    }
    case Unit.vmin: {
      name = 'max(vw, vh)'
      break
    }
    case Unit.vmin: {
      name = 'min(vw, vh)'
      break
    }
    case Unit.vw: {
      name = '1% viewport width'
      break
    }
    case Unit.vh: {
      name = '1% viewport height'
      break
    }
    case Unit.unmanaged: {
      name = 'unmanaged'
      break
    }
  }
  return name
}

// /**
//  * Convert [point strings](#IInputPoint) with units to a pixel point.
//  * @param v: IInputPoint
//  * @param bounds: IRLGBounds
//  */
// export function toPixel(v: IInputPoint, bounds: IRLGBounds): IPoint {
//   let xV = v.x
//   let xU = Unit.pixel
//   if (typeof v.x === 'string') {
//     const u = toUnit(v.x)
//     xU = u ? u : Unit.pixel
//     if (
//       xU === Unit.percent ||
//       xU === Unit.vw ||
//       xU === Unit.vh ||
//       xU === Unit.vmin ||
//       xU === Unit.vmax
//     ) {
//       xV = parseFloat(v.x as string) / 100
//     } else {
//       xV = parseFloat(v.x as string)
//     }
//   }

//   let yV = v.y
//   let yU = Unit.pixel
//   if (typeof v.x === 'string') {
//     const u = toUnit(v.x)
//     yU = u ? u : Unit.pixel
//     if (
//       yU === Unit.percent ||
//       yU === Unit.vw ||
//       yU === Unit.vh ||
//       yU === Unit.vmin ||
//       yU === Unit.vmax
//     ) {
//       yV = parseFloat(v.x as string) / 100
//     } else {
//       yV = parseFloat(v.x as string)
//     }
//   }
//   yV = parseFloat(v.y as string)

//   return {
//     x: toXPixel(xV as number, xU, bounds),
//     y: toYPixel(yV as number, yU, bounds)
//   }
// }

// export function toPercent(v: IPoint, unit: Unit, bounds: IRLGBounds): IPoint {
//   switch (unit) {
//     case Unit.unmanaged:
//     case Unit.pixel: {
//       return {
//         x: (v.x / bounds.local.width) * 100,
//         y: (v.y / bounds.local.height) * 100
//       }
//     }
//     case Unit.percent: {
//       return v
//     }
//     case Unit.vmin: {
//       return v
//     }
//     case Unit.vw: {
//       return v
//     }
//     case Unit.vh: {
//       return v
//     }
//   }
//   return v
// }

/**
 * Layout calculates the x, y, width and height of a Block. The
 * rules follow [css](https://www.w3.org/TR/css-position-3/#size-and-position-details)
 * except that ltr layout is used.
 *
 * Rules are based on the equations:
 *
 * ```
 * 1) left + width + right = bounds.local.width
 * 2) top + height + bottom = bounds.local.height
 * ```
 *
 * Each rule solves for the unknowns in the above equations
 *
 * @param args: IPositionLocation
 * @param containerSize: ISize
 */
export function layout(args: IBlockRect, bounds: IRLGBounds): IRect {
  function isValid(x: number | undefined) {
    return x !== undefined && !isNaN(x)
  }

  const leftValid = isValid(args.left)
  const topValid = isValid(args.top)
  const rightValid = isValid(args.right)
  const bottomValid = isValid(args.bottom)
  const widthValid = isValid(args.width)
  const heightValid = isValid(args.height)

  const result: IRect = {
    x: 0,
    y: 0,
    width: bounds.container.width,
    height: bounds.container.height
  }

  //
  // Width Rules
  //

  // rule#1: If left and width are auto and right is not auto, then the width is
  // shrink-to-fit. Then solve for left.
  if (!leftValid && !widthValid && rightValid) {
    // rule#1 width is shrink to fit
    const right = toXPixel(args.right!, args.rightUnit, bounds)
    result.x = 0
    result.width = bounds.container.width - right - result.x
  }

  // Rule#2: If left and right are auto and width is not auto, then if the direction
  // property of the element establishing the static-position containing
  // block is ltr set left to the static-position, otherwise set right to
  // the static-position. Then solve for left (if 'direction is rtl) or
  // right (if direction is ltr).

  // Assume ltr
  if (!leftValid && !rightValid && widthValid) {
    const width = toXPixel(args.width!, args.widthUnit, bounds)
    result.x = 0 // bounds.container.width - width
    result.width = width
  }

  // Rule#3: If width and right are auto and left is not auto, then the
  // width is shrink-to-fit. Then solve for right.
  if (!widthValid && !rightValid && leftValid) {
    const left = toXPixel(args.left!, args.leftUnit, bounds)
    result.x = left
    result.width = bounds.container.width - left
  }

  // Rule#4: If left is auto, width and right are not auto, then solve
  // for left.
  if (widthValid && rightValid && !leftValid) {
    const right = toXPixel(args.right!, args.rightUnit, bounds)
    const width = toYPixel(args.width!, args.widthUnit, bounds)
    result.x = bounds.container.width - width - right
    result.width = width
  }

  // Rule#5: If width is auto, left and right are not auto, then solve
  // for width.
  if (!widthValid && rightValid && leftValid) {
    const left = toXPixel(args.left!, args.leftUnit, bounds)
    const right = toXPixel(args.right!, args.rightUnit, bounds)
    result.x = left
    result.width = bounds.container.width - left - right
  }

  // Rule#6: If right is auto, left and width are not auto, then solve
  // for right.
  if (widthValid && !rightValid && leftValid) {
    const left = toXPixel(args.left!, args.leftUnit, bounds)
    const width = toYPixel(args.width!, args.widthUnit, bounds)
    result.x = left
    result.width = width
  }

  //
  // Height Rules
  //

  // Rule#1: If top and height are auto and bottom is not auto, then
  // the height is based on the Auto heights for block formatting
  // context roots, and solve for top.
  if (!heightValid && !topValid && bottomValid) {
    const bottom = toYPixel(args.bottom!, args.bottomUnit, bounds)
    result.y = 0
    result.height = bounds.container.height - bottom
  }

  // Rule#2: If top and bottom are auto and height is not auto, then
  // set top to the static position, then solve for bottom.
  if (heightValid && !topValid && !bottomValid) {
    const height = toYPixel(args.height!, args.heightUnit, bounds)
    result.y = 0
    result.height = height
  }

  // Rule#3: If height and bottom are auto and top is not auto, then
  // the height is based on the Auto heights for block formatting
  // context roots, and solve for bottom.
  if (!heightValid && topValid && !bottomValid) {
    const top = toYPixel(args.top!, args.topUnit, bounds)
    result.y = top
    result.height = bounds.container.height - top
  }

  // Rule#4: If top is auto, height and bottom are not auto, then
  // solve for top.
  if (heightValid && !topValid && bottomValid) {
    const bottom = toYPixel(args.bottom!, args.bottomUnit, bounds)
    const height = toYPixel(args.height!, args.heightUnit, bounds)
    result.y = bounds.container.height - bottom - height
    result.height = args.height!
  }

  // Rule#5: If height is auto, top and bottom are not auto, then
  // solve for height.
  if (!heightValid && topValid && bottomValid) {
    const bottom = toYPixel(args.bottom!, args.bottomUnit, bounds)
    const top = toYPixel(args.top!, args.topUnit, bounds)
    result.y = top
    result.height = bounds.container.height - top - bottom
  }

  // Rule#6: If bottom is auto, top and height are not auto, then
  // solve for bottom.
  if (heightValid && topValid && !bottomValid) {
    const top = toYPixel(args.top!, args.topUnit, bounds)
    const height = toYPixel(args.height!, args.heightUnit, bounds)
    result.y = top
    result.height = height
  }

  return result
}

/**
 * InverseLayout calculates inverse of layout. The
 * rules follow [css](https://www.w3.org/TR/css-position-3/#size-and-position-details)
 * except that ltr layout is used.
 *
 * Rules are based on the equations:
 *
 * ```
 * 1) left + width + right = bounds.local.width
 * 2) top + height + bottom = bounds.local.height
 * ```
 *
 * Each rule solves for the unknowns in the above equations
 *
 * @param args: IPositionLocation
 * @param containerSize: ISize
 */
export function inverseLayout(
  r: IRect,
  args: IBlockRect,
  bounds: IRLGBounds
): IBlockRect {
  function isValid(x: number | undefined) {
    return x !== undefined && !isNaN(x)
  }

  const leftValid = isValid(args.left)
  const topValid = isValid(args.top)
  const rightValid = isValid(args.right)
  const bottomValid = isValid(args.bottom)
  const widthValid = isValid(args.width)
  const heightValid = isValid(args.height)

  const result: IBlockRect = {}

  //
  // Width Rules
  //

  // Inverse of given r.
  // rule#1: If left and width are auto and right is not auto, then the width is
  // shrink-to-fit. Then solve for left.
  if (!leftValid && !widthValid && rightValid) {
    // Solve for right, optionally compute inverse
    let right = bounds.container.width - r.x - r.width
    if (args.rightUnit) {
      right = inverseXUnit(right, args.rightUnit, bounds)
      result.rightUnit = args.rightUnit
    }
    result.right = right
  }

  // Inverse of given r.
  // Rule#2: If left and right are auto and width is not auto, then if the direction
  // property of the element establishing the static-position containing
  // block is ltr set left to the static-position, otherwise set right to
  // the static-position. Then solve for left (if 'direction is rtl) or
  // right (if direction is ltr).
  if (!leftValid && !rightValid && widthValid) {
    // Assume ltr
    // width known optionally compute inverse
    let width = r.width
    if (args.widthUnit) {
      width = inverseXUnit(width, args.widthUnit, bounds)
      result.widthUnit = args.widthUnit
    }
    result.width = width
  }

  // Inverse of given r.
  // Rule#3: If width and right are auto and left is not auto, then the
  // width is shrink-to-fit. Then solve for right.
  if (!widthValid && !rightValid && leftValid) {
    // left known, optionally compute inverse
    let left = r.x
    if (args.leftUnit) {
      left = inverseXUnit(left, args.leftUnit!, bounds)
      result.leftUnit = args.leftUnit
    }
    result.left = left
  }

  // Inverse of given r.
  // Rule#4: If left is auto, width and right are not auto, then solve
  // for left.
  if (widthValid && rightValid && !leftValid) {
    let right = bounds.container.width - r.x - r.width
    let width = r.width
    if (args.rightUnit) {
      right = inverseXUnit(right, args.rightUnit, bounds)
      result.rightUnit = args.rightUnit
    }
    if (args.widthUnit) {
      width = inverseXUnit(width, args.widthUnit, bounds)
      result.widthUnit = args.widthUnit
    }
    result.width = width
    result.right = right
  }

  // Inverse of given r.
  // Rule#5: If width is auto, left and right are not auto, then solve
  // for width.
  if (!widthValid && rightValid && leftValid) {
    let right = bounds.container.width - r.x - r.width
    let left = r.x
    if (args.rightUnit) {
      right = inverseXUnit(right, args.rightUnit, bounds)
      result.rightUnit = args.rightUnit
    }
    if (args.leftUnit) {
      left = inverseXUnit(left, args.leftUnit, bounds)
      result.leftUnit = args.leftUnit
    }
    result.right = right
    result.left = left
  }

  // Inverse of given r.
  // Rule#6: If right is auto, left and width are not auto, then solve
  // for right.
  if (widthValid && !rightValid && leftValid) {
    let left = r.x
    let width = r.width
    if (args.leftUnit) {
      left = inverseXUnit(left, args.leftUnit, bounds)
      result.leftUnit = args.leftUnit
    }
    if (args.widthUnit) {
      width = inverseXUnit(width, args.widthUnit, bounds)
      result.widthUnit = args.widthUnit
    }
    result.left = left
    result.width = width
  }

  //
  // Height Rules
  //

  // Inverse of given r.
  // Rule#1: If top and height are auto and bottom is not auto, then
  // the height is based on the Auto heights for block formatting
  // context roots, and solve for top.
  if (!heightValid && !topValid && bottomValid) {
    let bottom = bounds.container.height - r.y - r.height
    if (args.bottomUnit) {
      bottom = inverseYUnit(bottom, args.bottomUnit, bounds)
      result.bottomUnit = args.bottomUnit
    }
    result.bottom = bottom
  }

  // Inverse of given r.
  // Rule#2: If top and bottom are auto and height is not auto, then
  // set top to the static position, then solve for bottom.
  if (heightValid && !topValid && !bottomValid) {
    let height = r.height
    if (args.heightUnit) {
      height = inverseYUnit(height, args.heightUnit, bounds)
      result.heightUnit = args.heightUnit
    }
    result.height = height
  }

  // Inverse of given r.
  // Rule#3: If height and bottom are auto and top is not auto, then
  // the height is based on the Auto heights for block formatting
  // context roots, and solve for bottom.
  if (!heightValid && topValid && !bottomValid) {
    let top = r.y
    if (args.topUnit) {
      top = inverseYUnit(top, args.topUnit, bounds)
      result.topUnit = args.topUnit
    }
    result.top = top
  }

  // Inverse of given r.
  // Rule#4: If top is auto, height and bottom are not auto, then
  // solve for top.
  if (heightValid && !topValid && bottomValid) {
    let bottom = bounds.container.height - r.y - r.height
    let height = r.height
    if (args.bottomUnit) {
      bottom = inverseYUnit(bottom, args.bottomUnit, bounds)
      result.bottomUnit = args.bottomUnit
    }
    if (args.heightUnit) {
      height = inverseYUnit(height, args.heightUnit, bounds)
      result.heightUnit = args.heightUnit
    }
    result.bottom = bottom
    result.height = height
  }

  // Inverse of given r.
  // Rule#5: If height is auto, top and bottom are not auto, then
  // solve for height.
  if (!heightValid && topValid && bottomValid) {
    let bottom = bounds.container.height - r.y - r.height
    let top = r.y
    if (args.bottomUnit) {
      bottom = inverseYUnit(bottom, args.bottomUnit, bounds)
      result.bottomUnit = args.bottomUnit
    }
    if (args.topUnit) {
      top = inverseYUnit(top, args.topUnit, bounds)
      result.topUnit = args.topUnit
    }
    result.bottom = bottom
    result.top = top
  }

  // Inverse of given r.
  // Rule#6: If bottom is auto, top and height are not auto, then
  // solve for bottom.
  if (heightValid && topValid && !bottomValid) {
    let height = r.height
    let top = r.y
    if (args.heightUnit) {
      height = inverseYUnit(height, args.heightUnit, bounds)
      result.heightUnit = args.heightUnit
    }
    if (args.topUnit) {
      top = inverseYUnit(top, args.topUnit, bounds)
      result.topUnit = args.topUnit
    }
    result.height = height
    result.top = top
  }

  return result
}

/**
 * Take x-axis pixel and convert to unit value
 */
export function inverseXUnit(
  value: number,
  unit: Unit,
  bounds: IRLGBounds
): number {
  // Default is Unit.pixel
  let r: number = value
  switch (unit) {
    case Unit.percent: {
      if (bounds.container.width) {
        r = value / bounds.container.width
      }
      break
    }
    case Unit.vw: {
      if (bounds.viewport.width) {
        r = value / bounds.viewport.width
      }
      break
    }
    case Unit.vh: {
      if (bounds.viewport.height) {
        r = value / bounds.viewport.height
      }
      break
    }
    case Unit.vmin: {
      if (bounds.viewport.width && bounds.viewport.height) {
        const min = Math.min(bounds.viewport.width, bounds.viewport.height)
        r = value / min
      }
      break
    }
    case Unit.vmax: {
      if (bounds.viewport.width && bounds.viewport.height) {
        const max = Math.max(bounds.viewport.width, bounds.viewport.height)
        r = value / max
      }
      break
    }
  }

  return r
}

/**
 * Take y-axis pixel and convert to unit value
 */
export function inverseYUnit(
  value: number,
  unit: Unit,
  bounds: IRLGBounds
): number {
  // Default is Unit.pixel
  let r: number = value
  switch (unit) {
    case Unit.percent: {
      if (bounds.container.height) {
        r = value / bounds.container.height
      }
      break
    }
    case Unit.vw: {
      if (bounds.viewport.width) {
        r = value / bounds.viewport.width
      }
      break
    }
    case Unit.vh: {
      if (bounds.viewport.height) {
        r = value / bounds.viewport.height
      }
      break
    }
    case Unit.vmin: {
      if (bounds.viewport.width && bounds.viewport.height) {
        const min = Math.min(bounds.viewport.width, bounds.viewport.height)
        r = value / min
      }
      break
    }
    case Unit.vmax: {
      if (bounds.viewport.width && bounds.viewport.height) {
        const max = Math.max(bounds.viewport.width, bounds.viewport.height)
        r = value / max
      }
      break
    }
  }

  return r
}

/**
 * Computes the pixel offset on the Y axis.
 * @param value
 * @param unit
 * @param bounds
 */
export function toXPixel(
  value: number,
  unit: Unit | undefined,
  bounds: IRLGBounds
): number {
  if (!unit || !bounds) {
    return value
  }

  // if (!bounds.local || !bounds.viewport) {
  //   return value
  // }

  switch (unit) {
    case Unit.percent: {
      return value * bounds.container.width
    }
    case Unit.pmin: {
      const minWidth = Math.min(bounds.container.width, bounds.container.height)
      return value * minWidth
      break
    }
    case Unit.pmax: {
      const maxWidth = Math.max(bounds.container.width, bounds.container.height)
      return value * maxWidth
      break
    }
    case Unit.pw: {
      return value * bounds.container.width
    }
    case Unit.ph: {
      return value * bounds.container.height
    }
    case Unit.vmin: {
      const minWidth = Math.min(bounds.viewport.width, bounds.viewport.height)
      return value * minWidth
      break
    }
    case Unit.vmax: {
      const maxWidth = Math.max(bounds.viewport.width, bounds.viewport.height)
      return value * maxWidth
      break
    }
    case Unit.vw: {
      return value * bounds.viewport.width
    }
    case Unit.vh: {
      return value * bounds.viewport.height
    }
  }

  return value
}

/**
 * Computes the pixel offset on the Y axis.
 * @param value
 * @param unit
 * @param containerSize
 */
export function toYPixel(
  value: number,
  unit: Unit | undefined,
  bounds: IRLGBounds
) {
  if (!unit) {
    return value
  }

  switch (unit) {
    case Unit.percent: {
      return value * bounds.container.height
    }
    case Unit.pmin: {
      const minWidth = Math.min(bounds.container.width, bounds.container.height)
      return value * minWidth
      break
    }
    case Unit.pmax: {
      const minWidth = Math.max(bounds.container.width, bounds.container.height)
      return value * minWidth
      break
    }
    case Unit.pw: {
      return value * bounds.container.width
    }
    case Unit.ph: {
      return value * bounds.container.height
    }
    case Unit.vmin: {
      const minWidth = Math.min(bounds.viewport.width, bounds.viewport.height)
      return value * minWidth
      break
    }
    case Unit.vmax: {
      const minWidth = Math.max(bounds.viewport.width, bounds.viewport.height)
      return value * minWidth
      break
    }
    case Unit.vw: {
      return value * bounds.viewport.width
    }
    case Unit.vh: {
      return value * bounds.viewport.height
    }
  }

  return value
}
