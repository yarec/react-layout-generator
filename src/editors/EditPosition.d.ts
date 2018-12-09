import * as React from 'react';
import Layout from 'src/components/Layout';
import { IPoint, IRect } from 'src/types';
import { IEditor, IEditorProps, IUndo } from './Editor';
export default class EditPosition extends React.Component<IEditorProps, {}> implements IEditor {
    _clonedLayout: Layout;
    _startOrigin: IPoint;
    _handle: IRect;
    redo: () => {};
    undo: () => {};
    constructor(props: IEditorProps);
    initUpdate(x: number, y: number): void;
    moveUpdate(x: number, y: number): void;
    addEventListeners: () => void;
    removeEventListeners: () => void;
    push: () => IUndo;
    onMouseDown: (event: React.MouseEvent<Element>) => void;
    onHtmlMouseMove: (event: MouseEvent) => void;
    onHtmlMouseUp: (event: MouseEvent) => void;
    onHtmlTouchMove: (event: TouchEvent) => void;
    render: () => JSX.Element;
}
