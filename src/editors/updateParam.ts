import Block, { IEdit } from '../components/Block'
import { ParamValue } from '../components/Params'
import { IRect } from '../types'

export interface INamedValue {
  name: string
  value: ParamValue
}

export type UpdateParam = (
  updated: IRect,
  edit: IEdit,
  block: Block
) => INamedValue
