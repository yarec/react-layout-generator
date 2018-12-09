import { IPoint, IRect, ISize } from '../types';
export declare type ParamValue = number | IPoint | ISize | IRect;
export default class Params {
    map: Map<string, ParamValue>;
    changeCount: number;
    constructor(values: Array<[string, ParamValue]>);
    restore(name: string, values: Array<[string, ParamValue]>): this;
    changed(): boolean;
    touch(): void;
    get(key: string): ParamValue | undefined;
    set(key: string, v: ParamValue): boolean;
}
