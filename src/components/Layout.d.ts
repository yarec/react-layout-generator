import { ExtendElement } from '../editors/extendElement';
import { UpdateHandle } from '../editors/updateHandle';
import { UpdateParam } from '../editors/updateParam';
import { IGenerator } from '../generators/Generator';
import { IPoint, ISize, Rect } from '../types';
export interface IAlign {
    x: number;
    y: number;
}
/**
 * Defines the units of location and size
 */
export declare enum IUnit {
    unmanaged = 0,
    pixel = 1,
    percent = 2,
    preserve = 3,
    preserveWidth = 4,
    preserveHeight = 5
}
export interface IOrigin {
    x: number;
    y: number;
}
export declare enum PositionRef {
    position = 1,
    top = 2,
    bottom = 3,
    left = 4,
    right = 5,
    leftTop = 6,
    rightTop = 7,
    leftBottom = 8,
    rightBottom = 9
}
export declare function move(rect: Rect): Rect;
export declare function update(rect: Rect): void;
export interface IEdit {
    ref: PositionRef;
    variable?: string;
    cursor?: string;
    updateHandle?: UpdateHandle;
    extendElement?: ExtendElement;
    updateParam?: UpdateParam;
}
export declare type PositionChildren = (layout: Layout, g: IGenerator, index: number) => Layout | undefined;
export interface IHandlers {
    onMouseDown?: () => void;
}
export interface IPosition {
    units: {
        origin: IOrigin;
        location: IUnit;
        size: IUnit;
    };
    align?: {
        key: string | number;
        offset: IPoint;
        source: IAlign;
        self: IAlign;
    };
    positionChildren?: PositionChildren;
    edit?: IEdit[];
    handlers?: IHandlers;
    location: IPoint;
    size: ISize;
}
/**
 * Defines the location and size using
 * specified origin and units. Supports edit handles
 * defined by IAlign (.eg left center, right bottom)
 */
export default class Layout {
    readonly name: string;
    readonly edit: IEdit[] | undefined;
    readonly units: {
        origin: IOrigin;
        location: IUnit;
        size: IUnit;
    };
    readonly location: IPoint;
    readonly size: ISize;
    readonly resize: (width: number, height: number) => void;
    readonly generator: IGenerator;
    readonly positionChildren: PositionChildren | undefined;
    readonly position: IPosition;
    private _name;
    private _position;
    private _changed;
    private _cached;
    private _g;
    private _positionChildren;
    constructor(name: string, p: IPosition, g: IGenerator);
    clone: () => Layout;
    /**
     * Converts location to pixels
     */
    fromLocation: () => IPoint;
    /**
     * Converts size to pixels
     */
    fromSize: () => ISize;
    rect: (force?: boolean | undefined) => {
        y: number;
        x: number;
        width: number;
        height: number;
        location: IPoint;
        size: ISize;
        top: number;
        left: number;
        bottom: number;
        right: number;
        leftTop: IPoint;
    };
    touch: () => void;
    /**
     * Change the layout state
     */
    update: (location: IPoint, size: ISize) => void;
    updateSize: (size: ISize) => void;
    /**
     * Take percent and convert to real world
     */
    scale: (input: IPoint | ISize, unit: IUnit) => IPoint | ISize;
    onResize: (width: number, height: number) => void;
    /**
     * Take pixels and convert to percent
     */
    private inverseScale;
    /**
     * Defines the origin of location in percent
     * If the origin is (50,50) then the top left is
     * (p.x - .50 * s.x, p.y - .50 * s.y)
     *
     *  x----------------
     *  |               |
     *  |       o       |
     *  |               |
     *  ----------------
     *  o: origin
     *  x: left top
     */
    private fromOrigin;
    /**
     * reverses fromOrigin
     */
    private toOrigin;
    /**
     * Compute left top point of rectangle based on align value
     * If p represents the bottom center point then the top left
     * position is (p.x - s.x / 2, p.y - s.y;)
     * Inverse of toAlign.
     */
    private fromAlign;
    /**
     * Gets the point of an handle given an origin and size
     * if align is left top then return (rect.left, rect.top)
     * if align if bottom center then return
     * (r.left + r.halfWidth, r.bottom;)
     *  Inverse of fromAlign.
     */
    private toAlign;
}
