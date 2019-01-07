import * as React from 'react';
import { ISize } from '../../../src/types';
import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
interface IProps {
    containersize: ISize;
    variable?: string;
    left?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    bold?: boolean;
}
export declare const Instruction: import("styled-components").StyledComponent<"p", any, IProps, never>;
export declare const List: import("styled-components").StyledComponent<"ul", any, IProps, never>;
export declare const Item: import("styled-components").StyledComponent<"li", any, IProps, never>;
export declare const Close: import("styled-components").StyledComponent<"button", any, IProps, never>;
interface IDeskTopState {
    update: number;
    containersize: ISize;
}
export default class DeskTop extends React.Component<IEditHelperProps, IDeskTopState> {
    private g;
    private _edit;
    constructor(props: IEditHelperProps);
    componentDidMount(): void;
    setEdit: (status: Status) => Status.down | Status.up;
    editState: () => Status.down | Status.up;
    render(): JSX.Element;
    closePanel: (e: React.MouseEvent<HTMLButtonElement>) => void;
    private closeButton;
}
export {};
