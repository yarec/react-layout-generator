import {IEdit} from '../components/Layout';
import {ParamValue} from '../components/Params';
import {IRect} from '../types';

export interface INamedValue {
  name: string;
  value: ParamValue;
}

export type UpdateParam = (updated: IRect, edit: IEdit) => INamedValue;
