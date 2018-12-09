import * as React from 'react';
import { IGenerator } from './generators/Generator';
import { ISize } from './types';
export declare let gInProgress: number;
export declare enum EditOptions {
    none = 0,
    all = 1
}
export declare enum DebugOptions {
    none = 0,
    info = 1,
    data = 2,
    warning = 4,
    error = 8,
    all = 15
}
export interface IReactLayoutProps extends React.HTMLProps<HTMLDivElement> {
    name?: string;
    edit?: EditOptions;
    save?: (name: string, params: string, layouts: string) => void;
    load?: (name: string) => {
        params: string;
        layouts: string;
    };
    viewport?: ISize;
    debug?: DebugOptions;
    g: IGenerator;
}
export interface IReactLayoutState {
    width: number;
    height: number;
    update: number;
}
export default class ReactLayout extends React.Component<IReactLayoutProps, IReactLayoutState> {
    private _g;
    private _edit;
    private _startRendering;
    private _count;
    constructor(props: IReactLayoutProps);
    getWidth: () => number;
    render(): React.ReactNode;
    private onResize;
    private onLayoutResize;
    private initLayout;
    private createPositionedElement;
    private updatePositionedElement;
    private updateUnmanagedElement;
    private createLayout;
    private updateElement;
    private onUpdate;
    private frameStart;
    private frameEnd;
    private content;
}
