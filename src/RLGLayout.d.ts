import * as React from 'react';
import Layout, { IPosition } from './components/Layout';
import { ParamValue } from './components/Params';
import { IGenerator } from './generators/Generator';
import { DebugOptions, DebugOptionsArray, IRect, ISize } from './types';
interface ILayoutStyle {
    style: React.CSSProperties;
    rect: IRect;
    position: IPosition;
    selected: boolean;
    zIndex: number;
}
export declare function selectedStyle(rect: IRect): {
    boxSizing: "border-box";
    width: number;
    height: number;
    position: "absolute";
    transform: string;
    transformOrigin: number;
    borderStyle: string;
    borderWidth: string;
    borderColor: string;
};
export declare function layoutStyle(args: ILayoutStyle): React.CSSProperties;
export declare let gInProgress: number;
export declare enum EditOptions {
    none = 0,
    all = 1
}
export declare const gLayouts: Map<string, RLGLayout>;
export interface IRLGLayoutProps extends React.HTMLProps<HTMLElement> {
    name: string;
    edit?: EditOptions;
    save?: (name: string, params: string, layouts: string) => void;
    load?: (name: string) => {
        params: string;
        layouts: string;
    };
    containersize?: ISize;
    debug?: DebugOptions | DebugOptionsArray;
    g: IGenerator;
    params?: Array<[string, ParamValue]>;
}
export interface IRLGLayoutState {
    width: number;
    height: number;
    update: number;
    contextMenu: Layout | undefined;
    contextMenuActive: boolean;
    devicePixelRatio: number;
}
export default class RLGLayout extends React.Component<IRLGLayoutProps, IRLGLayoutState> {
    private _root;
    private _g;
    private _data;
    private _edit;
    private _debug;
    private _startRendering;
    private _count;
    private _select;
    private _menuLocation;
    private _zIndex;
    constructor(props: IRLGLayoutProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: IRLGLayoutProps): void;
    getBoundingLeftTop: () => {
        x: number;
        y: number;
    };
    render(): React.ReactNode;
    private onRootRef;
    private initProps;
    private onWindowResize;
    private onResize;
    private onLayoutResize;
    private initLayout;
    private createPositionedElement;
    private updatePositionedElement;
    private updateUnmanagedElement;
    private createLayout;
    private updateElement;
    private onParentMouseDown;
    private onParentContextMenu;
    private generateContextMenu;
    private onHtmlMouseUp;
    private hideMenu;
    private addEventListeners;
    private removeEventListeners;
    private select;
    private onUpdate;
    private frameStart;
    private frameEnd;
    private content;
    private handleContextMenu;
    private positionChildren;
    private createEditors;
}
export {};
