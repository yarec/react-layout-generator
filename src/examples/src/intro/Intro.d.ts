import * as React from 'react';
import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
interface IIntroState {
    update: number;
}
export default class Intro extends React.Component<IEditHelperProps, IIntroState> {
    private _g;
    private _edit;
    constructor(props: IEditHelperProps);
    componentDidMount(): void;
    setEdit: (status: Status) => Status.down | Status.up;
    render(): JSX.Element;
}
export {};
