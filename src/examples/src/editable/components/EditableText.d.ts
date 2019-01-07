import * as React from 'react';
import Params from '../../../../src/components/Params';
import { EditOptions } from '../../../../src/RLGLayout';
import { DebugOptions, ISize } from '../../../../src/types';
interface IEditableTextProps {
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
    private _d;
    private _contentEditable;
    constructor(props: IEditableTextProps);
    onContextMenu: (event: React.MouseEvent<Element>) => void;
    handleChange: (event: React.FormEvent<HTMLDivElement>) => void;
    render(): JSX.Element;
}
export {};
