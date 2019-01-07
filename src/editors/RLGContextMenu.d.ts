import * as React from 'react';
import { IMenuItem } from 'src/components/Layout';
import { DebugOptions, IPoint, ISize } from 'src/types';
import '../assets/styles.css';
interface IContextMenuProps {
    commands: IMenuItem[];
    location: IPoint;
    bounds: ISize;
    debug: DebugOptions;
    hideMenu: () => void;
    zIndex: number;
}
export default class RLGContextMenu extends React.Component<IContextMenuProps> {
    private _root;
    constructor(props: IContextMenuProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private createChildren;
    private _onMouseDown;
    private _onClick;
    private _init;
    private _onHtmlClick;
}
export {};
