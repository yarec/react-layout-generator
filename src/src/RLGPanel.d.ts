import * as React from 'react';
import Layout from './components/Layout';
import { IGenerator } from './generators/Generator';
import { EditOptions } from './RLGLayout';
import { DebugOptions, IRect } from './types';
export interface IRLGPanelArgs {
    container: IRect;
    layout: Layout;
    edit: EditOptions;
    debug: DebugOptions;
    g: IGenerator;
    context: Map<string, any>;
}
interface IRLGPanelProps extends React.HTMLProps<HTMLDivElement> {
    container?: IRect;
    layout?: Layout;
    edit?: EditOptions;
    debug?: DebugOptions;
    g?: IGenerator;
    context?: Map<string, any>;
}
interface IRLGPanelState {
    rect: IRect;
}
export default class RLGPanel extends React.Component<IRLGPanelProps, IRLGPanelState> {
    constructor(props: IRLGPanelProps);
    componentWillReceiveProps(props: IRLGPanelProps): void;
    render(): JSX.Element;
}
export {};
