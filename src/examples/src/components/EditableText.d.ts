import * as React from 'react';
import { IOrigin } from '../../../src/components/Layout';
import Params from '../../../src/components/Params';
import { EditOptions } from '../../../src/RLGLayout';
import { DebugOptions, ISize } from '../../../src/types';
interface IProps {
    containersize: ISize;
    origin: IOrigin;
    fontSize: number;
}
export declare const Editable: import("styled-components").StyledComponent<"div", any, IProps, never>;
export declare const NotEditable: import("styled-components").StyledComponent<"div", any, IProps, never>;
interface IEditableTextProps extends React.Props<HTMLDivElement> {
    params: Params;
    edit: EditOptions;
    debug: DebugOptions;
    variable: string;
    containersize: ISize;
}
interface IEditableTextState {
    update: number;
}
export default class EditableText extends React.Component<IEditableTextProps, IEditableTextState> {
    private _root;
    private _mutationObserver;
    private _innerTextBuffer;
    private _data;
    constructor(props: IEditableTextProps);
    onContextMenu: (event: React.MouseEvent<Element>) => void;
    componentDidMount(): void;
    render(): JSX.Element;
    private onMouseDown;
    private onContentChange;
    private onRootRef;
    private calculateFontSize;
}
export {};
