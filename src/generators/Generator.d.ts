import { ISize } from 'src/types';
import Layout, { IPosition } from '../components/Layout';
import Layouts from '../components/Layouts';
import Params from '../components/Params';
export declare type IInit = (g: IGenerator) => Layouts;
export interface ICreate {
    index: number;
    count: number;
    name: string;
    g: IGenerator;
    position: IPosition;
}
export declare type Create = (args: ICreate) => Layout | undefined;
export interface IGenerator {
    name: () => string;
    params: () => Params;
    layouts: () => Layouts;
    reset: () => void;
    next: () => Layout | undefined;
    lookup: (name: string) => Layout | undefined;
    viewport: (name: string) => ISize | undefined;
    clear: () => void;
    create?: Create;
    parent?: () => IGenerator | undefined;
}
export default class Generator implements IGenerator {
    currentLayout: Layout | undefined;
    state: () => Layout | undefined;
    private _name;
    private _params;
    private _layouts;
    private _layoutsIterator;
    private _init;
    private _create;
    private _parent;
    constructor(name: string, init: IInit, params: Params, create?: Create, parent?: IGenerator);
    name: () => string;
    params: () => Params;
    layouts: () => Layouts;
    lookup: (name: string) => Layout | undefined;
    viewport: (name: string) => ISize;
    create: (args: ICreate) => Layout | undefined;
    parent: () => IGenerator | undefined;
    reset: () => void;
    clear: () => void;
    start: () => Layout | undefined;
    next: () => Layout | undefined;
    private nextBlock;
    private nextTile;
}
