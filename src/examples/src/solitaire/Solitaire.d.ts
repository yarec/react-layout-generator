import * as React from 'react';
import { IEditHelperProps } from '../../../src/editors/EditHelper';
export interface ISolitaireProps {
    name?: string;
}
interface ISolitaireState {
    update: number;
}
export default class Solitaire extends React.Component<IEditHelperProps, ISolitaireState> {
    private _g;
    private _stock;
    private _waste;
    private _foundation;
    private _tableau;
    constructor(props: IEditHelperProps);
    componentDidMount(): void;
    update: () => void;
    init(): void;
    newGame: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onPopulateWaste: (event: React.MouseEvent<HTMLDivElement>) => void;
    render(): JSX.Element;
    protected foundations: () => JSX.Element[];
    protected tableaus: () => JSX.Element[];
    protected grid: () => JSX.Element[];
}
export {};
