import {IPoint, IRect, ISize } from '../types';
import {isEqual} from 'underscore';

export type ParamValue = number | IPoint | ISize | IRect;

export default class Params {
  params: Map<string, ParamValue>;
  changeCount: number;

  constructor(values: Array<[string, ParamValue]>) {
    this.params = new Map(values);
    this.changeCount = 0;
  }

  changed(): boolean {
    const changed = this.changeCount;
    this.changeCount = 0;
    return changed != 0;
  }

  get(key: string): ParamValue | undefined {
    return this.params.get(key);
  }

  set(key: string, v: ParamValue): boolean {
    const r: ParamValue | undefined = this.params.get(key);

    // Only set if changed
    if (r && !isEqual(v, r)) {
      // console.log('Param.set ', key);
      this.changeCount += 1;
      this.params.set(key, v);
      return true;
    } 
    
    if (!r) {
      // console.log('Param.set ', key);
      this.changeCount += 1;
      this.params.set(key, v);
      return true;
    }

    return false;
  }
}