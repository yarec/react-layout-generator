import {isEqual} from 'underscore';
import {IPoint, IRect, ISize } from '../types';

export type ParamValue = number | IPoint | ISize | IRect;

export default class Params {
  public params: Map<string, ParamValue>;
  public changeCount: number;

  constructor(values: Array<[string, ParamValue]>) {
    this.params = new Map(values);
    this.changeCount = 0;
  }

  public changed(): boolean {
    const changed = this.changeCount;
    this.changeCount = 0;
    return changed !== 0;
  }

  public touch() {
    this.changeCount += 1;
  }

  public get(key: string): ParamValue | undefined {
    return this.params.get(key);
  }

  public set(key: string, v: ParamValue): boolean {
    const r: ParamValue | undefined = this.params.get(key);

    // Only set if changed
    if (r && !isEqual(v, r)) {
      // console.log('Param.set ', key, v);
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