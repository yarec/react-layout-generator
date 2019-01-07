/// <reference types="react" />
import Layout, { IEdit } from 'src/components/Layout';
import RLGSelect from 'src/editors/RLGSelect';
import { IRect } from 'src/types';
import { DebugOptions } from 'src/types';
export interface IUndo {
    editor: IEditor;
}
export interface IEditor {
    push: () => IUndo;
    redo: () => void;
    undo: () => void;
}
export interface IEditorProps extends React.HTMLProps<HTMLDivElement> {
    key: string;
    layout: Layout;
    boundary: IRect;
    debug?: DebugOptions;
    edit: IEdit;
    handle: IRect;
    select: RLGSelect | undefined;
    onUpdate: (reset?: boolean) => void;
    zIndex: number;
}
