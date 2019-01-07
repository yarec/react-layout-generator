import * as React from 'react';
import { DebugOptions, IPoint, IRect } from '../types';
import { IEditor, IEditorProps, IUndo } from './Editor';
interface IEditLayoutState {
    activateDrag: boolean;
    contextMenu: boolean;
}
export default class RLGEditLayout extends React.Component<IEditorProps, IEditLayoutState> implements IEditor {
    _startRect: IRect;
    _startOrigin: IPoint;
    _handle: IRect;
    protected _debug: DebugOptions;
    protected _ctrlKey: boolean;
    protected _altKey: boolean;
    protected _menuLocation: IPoint;
    constructor(props: IEditorProps);
    shouldComponentUpdate(nextProps: IEditorProps, nextState: IEditLayoutState): boolean;
    render: () => JSX.Element | null;
    initUpdate(x: number, y: number): void;
    hideMenu: () => void;
    moveUpdate(x: number, y: number): void;
    redo: () => void;
    undo: () => void;
    addEventListeners: () => void;
    removeEventListeners: () => void;
    push: () => IUndo;
    onClick: (event: React.MouseEvent<Element>) => void;
    onMouseDown: (event: React.MouseEvent<Element>) => void;
    onTouchDown: (event: React.TouchEvent<Element>) => void;
    onHtmlMouseMove: (event: MouseEvent) => void;
    onHtmlMouseUp: (event: MouseEvent) => void;
    onHtmlTouchMove: (event: TouchEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
    componentWillReceiveProps: (props: IEditorProps) => void;
}
export {};
