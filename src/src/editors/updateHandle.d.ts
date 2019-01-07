import { IEdit } from '../components/Layout';
import { IRect } from '../types';
export declare type UpdateHandle = (rect: IRect) => IRect;
export default function getUpdateHandle(edit: IEdit): UpdateHandle;
