import { IUnit } from "./components/Layout";
import { IPoint, ISize } from "./types";
export declare function clone(aObject: any): any;
export interface IValue {
    unit: IUnit;
    value: IPoint | ISize;
}
export declare class PixelPoint {
    private _p;
    constructor(p: IPoint);
    toPercent(containersize: ISize): {
        x: number;
        y: number;
    };
}
export declare function toPixel(v: IValue, containersize: ISize): IPoint | ISize;
export declare function toPercent(v: IValue, containersize: ISize): IPoint | ISize;
export declare function add(v1: IValue, v2: IValue, containersize: ISize): {
    x: number;
    y: number;
    width?: undefined;
    height?: undefined;
} | {
    width: number;
    height: number;
    x?: undefined;
    y?: undefined;
};
