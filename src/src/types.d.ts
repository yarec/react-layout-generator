export declare type NestedFlags<T> = {
    [K in keyof T]: T[K] extends object ? NestedFlags<T[K]> : boolean;
};
export declare enum DebugOptions {
    none = 0,
    info = 1,
    warning = 2,
    warningAll = 1,
    error = 4,
    errorAll = 3,
    trace = 8,
    traceAll = 7,
    timing = 16,
    data = 32,
    mouseEvents = 64,
    all = 127
}
export declare type DebugOptionsArray = DebugOptions[];
export declare type Opaque<K, T> = T & {
    __TYPE__: K;
};
export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare function rectSize(rect: IRect): ISize;
export declare function rectPoint(rect: IRect): IPoint;
export interface IAttrRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export declare class Rect implements IRect {
    y: number;
    x: number;
    width: number;
    height: number;
    constructor(rect: IRect);
    update(rect: IRect): void;
    setLocation(p: IPoint): void;
    readonly data: IRect;
    location: IPoint;
    size: ISize;
    setSize(s: ISize): void;
    readonly top: number;
    readonly left: number;
    readonly bottom: number;
    readonly right: number;
    readonly leftTop: IPoint;
    translate(point: IPoint): IRect;
    add(rect: IRect): IRect;
}
export interface IPoint {
    x: number;
    y: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IArgsPoint {
    x: number | string;
    y: number | string;
}
export interface IArgsSize {
    width?: number | string;
    height?: number | string;
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    isEmpty: () => boolean;
}
