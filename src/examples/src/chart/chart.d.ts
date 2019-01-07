import * as React from 'react';
import Layout from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import { IEditHelperProps } from '../../../src/editors/EditHelper';
import { IGenerator } from '../../../src/generators/Generator';
interface IChartState {
    node: string;
}
export default class Chart extends React.Component<IEditHelperProps, IChartState> {
    private _g;
    private _params;
    private _treeMap;
    constructor(props: IEditHelperProps);
    render(): JSX.Element;
    init: (g: IGenerator) => Layouts;
    protected createElements(): null;
    protected renderConnection(layout: Layout): null;
}
export {};
