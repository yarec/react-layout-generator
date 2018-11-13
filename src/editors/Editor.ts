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

export interface EditorProps {
  key: string;
  layout: Layout;
  boundary: IRect;
  edit: IEdit;
}

export function createEditor(props: EditorProps) {

}