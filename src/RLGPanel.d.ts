import * as React from 'react';
import { IPosition } from './components/Layout';
import { IGenerator } from './generators/Generator';
import { ISize } from './types';
export interface ILayoutParent {
    name: string;
    position: IPosition;
}
export interface IRLPanelArgs {
    viewport: ISize;
    parent: ILayoutParent;
    edit: boolean;
    g: IGenerator;
}
interface IRLGPanelProps extends React.HTMLProps<HTMLDivElement> {
    viewport?: ISize;
    parent?: ILayoutParent;
    edit?: boolean;
    g?: IGenerator;
}
interface IRLGPanelState {
    viewport: ISize;
}
export default class RLGPanel extends React.Component<IRLGPanelProps, IRLGPanelState> {
    constructor(props: IRLGPanelProps);
    componentWillReceiveProps(props: IRLGPanelProps): void;
    render(): JSX.Element;
}
export {};
