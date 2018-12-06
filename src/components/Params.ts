import {isEqual} from 'underscore';
import {IPoint, IRect, ISize } from '../types';

export type ParamValue = number | IPoint | ISize | IRect;

export default class Params {
  public map: Map<string, ParamValue>;
  public changeCount: number;

  constructor(values: Array<[string, ParamValue]>) {
    this.map = new Map(values);
    this.changeCount = 0;
  }

  public restore(name: string, values: Array<[string, ParamValue]>) {
    // 1) if params are empty then just insert the params

    if (this.map.size === 0) {
      values.forEach((value: [string, ParamValue]) => {
        this.map.set(value[0], value[1]);
      });

      return this;
    }

    // 2) verify that params has all the keys
    let count = 0;
    values.forEach((value: [string, ParamValue]) => {
      count += this.map.get(value[0]) ? 0 : 1;
    });

    if (count) {
      throw(new Error(`Params mismatch count: ${count}. Did you pass the wrong Params to generator ${name}?`));
    }

    return this;
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
    return this.map.get(key);
  }

  public set(key: string, v: ParamValue): boolean {
    const r: ParamValue | undefined = this.map.get(key);

    // Only set if changed
    if (r && !isEqual(v, r)) {
      // console.log('Param.set ', key, v);
      this.changeCount += 1;
      this.map.set(key, v);
      return true;
    } 
    
    if (!r) {
      // console.log('Param.set ', key);
      this.changeCount += 1;
      this.map.set(key, v);
      return true;
    }

    return false;
  }
}