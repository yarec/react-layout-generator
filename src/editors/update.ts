import Block, { IEdit, IUnit } from '../components/Block'
import { IRect } from '../types'

export function updateParamLocation(
  updated: IRect,
  edit: IEdit,
  layout: Block
) {
  let factor = 1
  if (layout.units.location !== IUnit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: {
      x: layout.position.location.x * factor,
      y: layout.position.location.y * factor
    }
  }
}

export function updateParamOffset(updated: IRect, edit: IEdit, layout: Block) {
  let factor = 1
  if (layout.units.location !== IUnit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: {
      x: layout.position.align!.offset.x * factor,
      y: layout.position.align!.offset.y * factor
    }
  }
}

export function updateParamWidth(updated: IRect, edit: IEdit, layout: Block) {
  let factor = 1
  if (layout.units.size !== IUnit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: updated.width * factor
  }
}

export function updateParamHeight(updated: IRect, edit: IEdit, layout: Block) {
  let factor = 1
  if (layout.units.size !== IUnit.pixel) {
    // convert to percent
    factor = 100
  }
  return {
    name: edit.variable!,
    value: updated.height * factor
  }
}
