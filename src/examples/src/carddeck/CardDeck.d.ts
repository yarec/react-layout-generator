import * as React from 'react';
import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
interface ICardDeckState {
    update: number;
}
export default class CardDeck extends React.Component<IEditHelperProps, ICardDeckState> {
    private _g;
    private _deck;
    private _edit;
    constructor(props: IEditHelperProps);
    componentDidMount(): void;
    setEdit: (status: Status) => Status.down | Status.up;
    render(): JSX.Element;
    private createElement;
    private createElements;
    private shuffle;
}
export {};
