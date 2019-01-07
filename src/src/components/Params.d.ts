import { DebugOptions, IAttrRect, IPoint, IRect, ISize } from '../types';
export interface IEditableTextData {
    content: string;
    font?: string;
    fontSize?: number;
    alpha?: number;
}
export declare type ParamValue = number | IPoint | ISize | IRect | IAttrRect | IEditableTextData;
export declare type Save = (prefix: string, key: string, value: ParamValue) => void;
export declare type Load = (prefix: string, key: string) => ParamValue | undefined;
export interface IParamsProps {
    name: string;
    initialValues?: Array<[string, ParamValue]>;
    save?: Save;
    load?: Load;
    debug?: DebugOptions;
}
export default class Params {
    private _map;
    private _changeCount;
    private _name;
    private _save;
    private _load;
    private _debug;
    constructor(props: IParamsProps);
    restore(name: string, values: Array<[string, ParamValue]>, replace?: boolean): this;
    readonly map: Map<string, ParamValue>;
    save: Save | undefined;
    load: Load | undefined;
    changed(): boolean;
    touch(): void;
    get(key: string, load?: boolean): ParamValue | undefined;
    set(key: string, v: ParamValue): boolean;
}
