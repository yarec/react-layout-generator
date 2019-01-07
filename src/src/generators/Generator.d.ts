import Layout, { IPosition } from '../components/Layout';
import Layouts from '../components/Layouts';
import Params, { ParamValue } from '../components/Params';
import EditHelper from '../editors/EditHelper';
import RLGSelect from '../editors/RLGSelect';
import { ISize } from '../types';
export interface IGeneratorFunctionArgs {
    name: string;
    exParams?: Params;
    editHelper?: EditHelper;
}
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
    containersize: (name: string) => ISize | undefined;
    clear: () => void;
    create?: Create;
    editor?: () => EditHelper | undefined;
}
export default class Generator implements IGenerator {
    currentLayout: Layout | undefined;
    state: () => Layout | undefined;
    private _name;
    private _editHelper;
    private _params;
    private _layouts;
    private _select;
    private _layoutsIterator;
    private _init;
    private _create;
    constructor(name: string, init: IInit, params: Params, create?: Create, editHelper?: EditHelper);
    name: () => string;
    editHelper: () => EditHelper | undefined;
    params: () => Params;
    layouts: () => Layouts;
    select: () => RLGSelect;
    lookup: (name: string) => Layout | undefined;
    containersize: (name: string) => ISize;
    create: (args: ICreate) => Layout | undefined;
    reset: () => void;
    clear: () => void;
    start: () => Layout | undefined;
    next: () => Layout | undefined;
    protected setup: (values: [string, ParamValue][]) => void;
    private nextBlock;
    private nextTile;
}
