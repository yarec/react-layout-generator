import * as React from 'react';
import EditHelper, { IEditTool } from '../../../src/editors/EditHelper';
export declare const Button: import("styled-components").StyledComponent<"button", any, {}, never>;
export declare const SelectedButton: import("styled-components").StyledComponent<"button", any, {}, never>;
interface IButton {
    component: (props: any) => JSX.Element;
    name: string;
}
interface IToolBarProps {
    commands: IButton[];
    editHelper: EditHelper;
}
interface IToolBarState {
    update: number;
}
export default class ToolBar extends React.Component<IToolBarProps, IToolBarState> implements IEditTool {
    private _n;
    private _params;
    constructor(props: IToolBarProps);
    componentWillReceiveProps(props: IToolBarProps): void;
    updateTool: () => void;
    render(): JSX.Element;
    private onClick;
    private createElements;
}
export {};
