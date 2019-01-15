import { Block, IEdit } from '../components/Block'
import { IRect, unitFactor } from '../types'

/**
 * internal use only
 * @ignore
 */
export function updateParamLocation(updated: IRect, edit: IEdit, block: Block) {
  const factor = unitFactor(block.position.size.unit)
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
  const factor = unitFactor(block.position.size.unit)
  let r = {
    name: edit.variable!,
    value: {
      x: 0,
      y: 0
    }
  }
  if (block.position.align) {
    r = {
      name: edit.variable!,
      value: {
        x: block.position.align!.offset.x * factor,
        y: block.position.align!.offset.y * factor
      }
    }
  }
  return r
}

/**
 * internal use only
 * @ignore
 */
export function updateParamWidth(updated: IRect, edit: IEdit, block: Block) {
  const factor = unitFactor(block.position.size.unit)
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
  const factor = unitFactor(block.position.size.unit)
  return {
    name: edit.variable!,
    value: updated.height * factor
  }
}
