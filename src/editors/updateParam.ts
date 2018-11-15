import {ParamValue} from '../components/Params';
import {IEdit} from '../components/Layout';
import {IRect} from '../types';

export interface NamedValue {
  name: string;
  value: ParamValue;
}

export type UpdateParam = (updated: IRect, edit: IEdit) => NamedValue;
