import * as React from 'react';
export declare const Button: import("styled-components").StyledComponent<"button", any, {}, never>;
export declare const SelectedButton: import("styled-components").StyledComponent<"button", any, {}, never>;
interface IElement {
    component: any;
    name: string;
}
interface INavBarProps {
    elements: IElement[];
    callback: (component: any) => void;
}
interface INavBarState {
    selected: string | undefined;
    update: number;
}
export default class NavBar extends React.Component<INavBarProps, INavBarState> {
    private n;
    private elementRefs;
    private _size;
    private _changed;
    constructor(props: INavBarProps);
    render(): JSX.Element;
    protected setSize: (name: string, v: number) => void;
    private createElements;
}
export {};
