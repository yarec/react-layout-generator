import { IEdit } from '../components/Layout';
import { IRect } from '../types';
export declare type ExtendElement = (rect: IRect, deltaX: number, deltaY: number) => IRect;
export default function getExtendElement(edit: IEdit): ExtendElement;
