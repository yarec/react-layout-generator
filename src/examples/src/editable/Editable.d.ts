import * as React from 'react';
import { ISize } from '../../../src/types';
import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
export declare const T: import("styled-components").StyledComponent<"div", any, {}, never>;
interface IDeskTopState {
    update: number;
    containersize: ISize;
}
export default class Editable extends React.Component<IEditHelperProps, IDeskTopState> {
    private g;
    private _edit;
    private _save;
    constructor(props: IEditHelperProps);
    componentDidMount(): void;
    setEdit: (status: Status) => Status.down | Status.up;
    editState: () => Status.down | Status.up;
    setSave: (status: Status) => undefined;
    saveState: () => Status.down | Status.up;
    render(): JSX.Element;
}
export {};
