import { Block, IEdit } from '../components/Block'
import { IRect, Unit } from '../types'

/**
 * internal use only
 * @ignore
 */
export function updateParamLocation(updated: IRect, edit: IEdit, block: Block) {
  let factor = 1
  if (block.units.location !== Unit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: {
      x: block.position.location.x * factor,
      y: block.position.location.y * factor
    }
  }
}

/**
 * internal use only
 * @ignore
 */
export function updateParamOffset(updated: IRect, edit: IEdit, block: Block) {
  let factor = 1
  if (block.units.location !== Unit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: {
      x: block.position.align!.offset.x * factor,
      y: block.position.align!.offset.y * factor
    }
  }
}

/**
 * internal use only
 * @ignore
 */
export function updateParamWidth(updated: IRect, edit: IEdit, block: Block) {
  let factor = 1
  if (block.units.size !== Unit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: updated.width * factor
  }
}

/**
 * internal use only
 * @ignore
 */
export function updateParamHeight(updated: IRect, edit: IEdit, block: Block) {
  let factor = 1
  if (block.units.size !== Unit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: updated.height * factor
  }
}
