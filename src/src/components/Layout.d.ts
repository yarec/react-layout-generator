/// <reference types="react" />
import { ExtendElement } from '../editors/extendElement';
import { UpdateHandle } from '../editors/updateHandle';
import { UpdateParam } from '../editors/updateParam';
import { IGenerator } from '../generators/Generator';
import { IPoint, ISize } from '../types';
export interface IAlign {
    x: number;
    y: number;
}
export declare enum IUnit {
    pixel = 1,
    percent = 2,
    preserve = 3,
    preserveWidth = 4,
    preserveHeight = 5,
    unmanaged = 6,
    unmanagedWidth = 7,
    unmanagedHeight = 8
}
export declare function symbolToIUnit(data: string): IUnit.pixel | IUnit.percent | IUnit.preserveWidth | IUnit.preserveHeight | IUnit.unmanagedWidth;
export declare function namedUnit(u: IUnit): string;
export interface IOrigin {
    x: number;
    y: number;
}
export declare enum PositionRef {
    none = 0,
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
export declare function namedPositionRef(pos: PositionRef): string;
export interface IMenuItem {
    name: string;
    disabled?: boolean;
    checked?: boolean;
    command?: () => void;
}
export interface IEdit {
    ref: PositionRef;
    variable?: string;
    cursor?: string;
    updateHandle?: UpdateHandle;
    extendElement?: ExtendElement;
    updateParam?: UpdateParam;
    contextMenu?: IMenuItem[];
}
export declare type PositionChildren = (layout: Layout, g: IGenerator, index: number) => Layout | undefined;
export interface IHandlers {
    onMouseDown?: () => void;
}
export declare type Layer = (zIndex: number) => number;
export declare enum LayerOption {
    normal = 0,
    moveToBack = 1,
    moveToFront = 2,
    moveUp = 3,
    moveDown = 4
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
    editor?: {
        selectable?: boolean;
        contextMenu?: IMenuItem[];
        edits?: IEdit[];
    };
    layer?: LayerOption;
    handlers?: IHandlers;
    location: IPoint;
    size: ISize;
}
export default class Layout {
    readonly name: string;
    readonly editor: {
        selectable?: boolean | undefined;
        contextMenu?: IMenuItem[] | undefined;
        edits?: IEdit[] | undefined;
    } | undefined;
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
    position: IPosition;
    sibling: string;
    private _siblings;
    private _name;
    private _position;
    private _changed;
    private _cached;
    private _g;
    private _positionChildren;
    private _layer;
    private _onMouseDown;
    private _onClick;
    constructor(name: string, p: IPosition, g: IGenerator);
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    layer(zIndex: number): number;
    connectionHandles: () => {
        x: number;
        y: number;
    }[];
    fromLocation: () => IPoint;
    fromSize: () => ISize;
    rect: (force?: boolean | undefined) => import("../types").IRect;
    touch: () => void;
    update: (location: IPoint, size?: ISize | undefined) => void;
    updateSize: (size: ISize) => void;
    scale: (input: ISize | IPoint, unit: IUnit) => ISize | IPoint;
    onResize: (width: number, height: number) => void;
    updateLayer(layer?: LayerOption): void;
    updatePosition(p: IPosition): void;
    setEditDefaults(edit: IEdit): void;
    private changed;
    private getRef;
    private getConnectPoint;
    private inverseScale;
    private fromOrigin;
    private toOrigin;
    private fromAlign;
    private toAlign;
}
