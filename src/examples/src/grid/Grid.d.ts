import * as React from 'react';
import { IUnit } from '../../../src/components/Layout';
import { ISize } from '../../../src/types';
import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
export interface IProps {
    containersize: ISize;
}
declare const CalloutBottom: import("styled-components").StyledComponent<"div", any, IProps, never>;
export { CalloutBottom };
export default class Grid extends React.Component<IEditHelperProps, {
    update: number;
}> {
    private _g;
    private _grid;
    private _gridUnitSquare;
    private _gridUnit;
    private _units;
    private _edit;
    constructor(props: IEditHelperProps);
    setPixel: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setPercent: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setPreserve: (event: React.MouseEvent<HTMLButtonElement>) => void;
    componentDidMount(): void;
    setEdit: (status: Status) => Status.down | Status.up;
    render(): JSX.Element;
    protected gridLegend: () => JSX.Element;
    protected controls: () => JSX.Element;
    protected control(selected: boolean, props: any): JSX.Element;
    protected grid: (unit: IUnit) => void;
    private clearCanvas;
    private setGrid;
}
