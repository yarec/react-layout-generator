import Layout, {IEdit} from '../components/Layout';
import {IRect} from '../types';
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
  edit: IEdit;
  onUpdate: (reset?: boolean)=>void;
}
