import Params from './Params';
import {IValue} from './Value';

export interface IEdit {
  positionRef: PositionRef;
  variable: string;
  update: (v: IValue, ref: PositionRef, deltaX: number, deltaY: number, params: Params) => IValue;
}