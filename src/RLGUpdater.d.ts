import * as React from 'react';
import { IGenerator } from './generators/Generator';
import { ILayoutParent } from './RLGPanel';
import { ISize } from './types';
interface IRLGUpdaterProps extends React.HTMLProps<HTMLDivElement> {
    viewport?: ISize;
    parent?: ILayoutParent;
    edit?: boolean;
    g?: IGenerator;
}
interface IRLGUpdaterState {
    update: number;
}
export default class RLGUpdater extends React.Component<IRLGUpdaterProps, IRLGUpdaterState> {
    private _computed;
    private _layout;
    constructor(props: IRLGUpdaterProps);
    render(): null;
    protected createElement(children: React.ReactNode): null;
    protected setSize: (element: HTMLElement) => void;
}
export {};
