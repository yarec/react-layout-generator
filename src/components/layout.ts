import { IBlockRect, IInputRect } from './Block'
import { ISize, IRect, Unit } from '../types'

/**
 * IRLGBounds provides the local and viewport bounds. It is updated by Layout
 * on every render. Both are in pixel units. Local is used for computing the
 * layout of each [Block](#Block). Both local and viewport are used to
 * in converting units to pixels depending upon the unit specified.
 */
export interface IRLGBounds {
  /**
   * Local is the size of the containing block in pixels.
   */
  local: ISize
  /**
   * Viewport is the user's visible area of a web page. It does not include
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
            if (
              unit === Unit.percent ||
              unit === Unit.vw ||
              unit === Unit.vh ||
              unit === Unit.vmin ||
              unit === Unit.vmax
            ) {
              // Convert to decimal
              internal[k] = value * 0.01
            } else {
              internal[k] = value
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
 * stringToUnit parses a string for an unit.
 * @param data
 */
export function toUnit(data: string) {
  const d = data.trim()
  switch (d.charAt(d.length - 1)) {
    case 'x': {
      switch (d.charAt(d.length - 2)) {
        case 'p': {
          return Unit.pixel
        }
        case 'a': {
          return Unit.vmax
        }
      }
      console.error(`data-layout: Unit ${d} not recognized`)
    }
    case '%': {
      return Unit.percent
    }
    case 'n': {
      return Unit.vmin
    }

    case 'h': {
      switch (d.charAt(d.length - 2)) {
        case 'v': {
          return Unit.vh
        }
      }
      console.error(`data-layout: Unit ${d} not recognized`)
      break
    }
    case 'w': {
      switch (d.charAt(d.length - 2)) {
        case 'v': {
          return Unit.vw
        }
      }
      console.error(`data-layout: Unit ${d} not recognized`)
      break
    }
    case 'u': {
      return Unit.u
    }
  }
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
    case Unit.u: {
      name = 'unmanaged'
      break
    }
  }
  return name
}

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

  const result: IRect = { x: 0, y: 0, width: NaN, height: NaN }

  //
  // Width Rules
  //

  // rule#1: If left and width are auto and right is not auto, then the width is
  // shrink-to-fit. Then solve for left.
  if (!leftValid && !widthValid && rightValid) {
    // rule#1 width is shrink to fit
    const right = layoutXToPixel(args.right!, args.rightUnit, bounds)
    result.x = bounds.local.width - right
    result.width = bounds.local.width - right - result.x
  }

  // Rule#2: If left and right are auto and width is not auto, then if the direction
  // property of the element establishing the static-position containing
  // block is ltr set left to the static-position, otherwise set right to
  // the static-position. Then solve for left (if 'direction is rtl) or
  // right (if direction is ltr).

  // Assume ltr
  if (!leftValid && !rightValid && widthValid) {
    const width = layoutXToPixel(args.width!, args.widthUnit, bounds)
    result.x = bounds.local.width - width
    result.width = width
  }

  // Rule#3: If width and right are auto and left is not auto, then the
  // width is shrink-to-fit. Then solve for right.
  if (!widthValid && !rightValid && leftValid) {
    const left = layoutXToPixel(args.left!, args.leftUnit, bounds)
    result.x = left
    result.width = bounds.local.width - left
  }

  // Rule#4: If left is auto, width and right are not auto, then solve
  // for left.
  if (widthValid && rightValid && !leftValid) {
    const right = layoutXToPixel(args.right!, args.rightUnit, bounds)
    const width = layoutXToPixel(args.width!, args.widthUnit, bounds)
    result.x = bounds.local.width - width - right
    result.width = width
  }

  // Rule#5: If width is auto, left and right are not auto, then solve
  // for width.
  if (!widthValid && rightValid && leftValid) {
    const left = layoutXToPixel(args.left!, args.leftUnit, bounds)
    const right = layoutXToPixel(args.right!, args.rightUnit, bounds)
    result.x = left
    result.width = bounds.local.width - left - right
  }

  // Rule#6: If right is auto, left and width are not auto, then solve
  // for right.
  if (widthValid && !rightValid && leftValid) {
    const left = layoutXToPixel(args.left!, args.leftUnit, bounds)
    const width = layoutXToPixel(args.width!, args.widthUnit, bounds)
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
    const bottom = layoutYToPixel(args.bottom!, args.bottomUnit, bounds)
    result.y = 0
    result.height = bounds.local.height - bottom
  }

  // Rule#2: If top and bottom are auto and height is not auto, then
  // set top to the static position, then solve for bottom.
  if (heightValid && !topValid && !bottomValid) {
    const height = layoutYToPixel(args.height!, args.heightUnit, bounds)
    result.y = 0
    result.height = height
  }

  // Rule#3: If height and bottom are auto and top is not auto, then
  // the height is based on the Auto heights for block formatting
  // context roots, and solve for bottom.
  if (!heightValid && topValid && !bottomValid) {
    const top = layoutYToPixel(args.top!, args.topUnit, bounds)
    result.y = top
    result.height = bounds.local.height - top
  }

  // Rule#4: If top is auto, height and bottom are not auto, then
  // solve for top.
  if (heightValid && !topValid && bottomValid) {
    const bottom = layoutYToPixel(args.bottom!, args.bottomUnit, bounds)
    const height = layoutYToPixel(args.height!, args.heightUnit, bounds)
    result.y = bounds.local.height - bottom - height
    result.height = args.height!
  }

  // Rule#5: If height is auto, top and bottom are not auto, then
  // solve for height.
  if (!heightValid && topValid && bottomValid) {
    const bottom = layoutYToPixel(args.bottom!, args.bottomUnit, bounds)
    const top = layoutYToPixel(args.top!, args.topUnit, bounds)
    result.y = top
    result.height = bounds.local.height - top - bottom
  }

  // Rule#6: If bottom is auto, top and height are not auto, then
  // solve for bottom.
  if (heightValid && topValid && !bottomValid) {
    // top + height + bottom = containerSize.height
    result.y = args.top!
    result.height = args.height!
  }

  return result
}

/**
 * Computes the pixel offset on the Y axis.
 * @param value
 * @param unit
 * @param containerSize
 */
export function layoutXToPixel(
  value: number,
  unit: Unit | undefined,
  bounds: IRLGBounds
): number {
  if (!unit) {
    return value
  }

  switch (unit) {
    case Unit.percent: {
      return value * bounds.local.width
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
export function layoutYToPixel(
  value: number,
  unit: Unit | undefined,
  bounds: IRLGBounds
) {
  if (!unit) {
    return value
  }

  switch (unit) {
    case Unit.percent: {
      return value * bounds.local.height
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
