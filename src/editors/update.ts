import { Block, IEdit } from '../components/Block'
import { IRect, unitFactor } from '../types'

/**
 * UpdateParamLocation computes a [location](interfaces/ipositionlocation.html) update.
 */
export function updateParamLocation(updated: IRect, edit: IEdit, block: Block) {
  const factor = unitFactor(block.position.size.unit)
  return {
    name: edit.variable!,
    value: {
      x: block.position.location.x! * factor,
      y: block.position.location.y! * factor,
      unit: block.position.size.unit
    }
  }
}

/**
 * updateParamOffset computes the [offset](interfaces/ialign.html) update.
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
 * updateParamWidth computes the width update. Only use this UpdateParam if
 * a generator directly uses the width in computing a layout.
 */
export function updateParamWidth(updated: IRect, edit: IEdit, block: Block) {
  const factor = unitFactor(block.position.size.unit)
  return {
    name: edit.variable!,
    value: updated.width * factor
  }
}

/**
 * updateParamWidth computes the height update. Only use this UpdateParam if
 * a generator directly uses the height in computing a layout.
 */
export function updateParamHeight(updated: IRect, edit: IEdit, block: Block) {
  const factor = unitFactor(block.position.size.unit)
  return {
    name: edit.variable!,
    value: updated.height * factor
  }
}
