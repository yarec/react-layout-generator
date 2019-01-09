import Block, { IEdit } from '../components/Block'
import { ParamValue } from '../components/Params'
import { IRect } from '../types'

/**
 * internal use only
 * @ignore
 */
export interface INamedValue {
  name: string
  value: ParamValue
}

/**
 * internal use only
 * @ignore
 */
export type UpdateParam = (
  updated: IRect,
  edit: IEdit,
  block: Block
) => INamedValue
