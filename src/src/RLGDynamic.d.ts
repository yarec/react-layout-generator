import * as React from 'react';
import Layout from './components/Layout';
import { IGenerator } from './generators/Generator';
import { EditOptions } from './RLGLayout';
import { DebugOptions, IRect } from './types';
interface IRLGDynamicProps extends React.HTMLProps<HTMLDivElement> {
    jsx: JSX.Element[];
    container?: IRect;
    layout?: Layout;
    edit?: EditOptions;
    debug?: DebugOptions;
    g?: IGenerator;
    context?: Map<string, any>;
}
export default class RLGDynamic extends React.Component<IRLGDynamicProps, IRLGDynamicProps> {
    private _jsx;
    constructor(props: IRLGDynamicProps);
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
