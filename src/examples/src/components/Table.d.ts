import * as React from 'react';
import { ISize } from '../../../src/types';
interface ITableProps extends React.HTMLProps<HTMLDivElement> {
    name: string;
    title: string;
    containersize: ISize;
    rowData: string[][];
}
export default class Table extends React.Component<ITableProps> {
    private _g;
    private _params;
    constructor(props: ITableProps);
    render(): JSX.Element;
    private createRows;
    private init;
    private positionRowChildren;
    private create;
}
export {};
