import { IEdit } from '../components/Layout';
import { ParamValue } from '../components/Params';
import { IRect } from '../types';
export interface INamedValue {
    name: string;
    value: ParamValue;
}
export declare type UpdateParam = (updated: IRect, edit: IEdit) => INamedValue;
