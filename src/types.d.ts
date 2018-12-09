export declare type Opaque<K, T> = T & {
    __TYPE__: K;
};
export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class Rect implements IRect {
    y: number;
    x: number;
    width: number;
    height: number;
    constructor(rect: IRect);
    update(rect: IRect): void;
    setLocation(p: IPoint): void;
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
export declare class Point implements IPoint {
    x: number;
    y: number;
    isEmpty: () => boolean;
}
