import Layout, {IEdit} from '../components/Layout';
import RLGSelect from '../editors/RLGSelect';
import {IRect} from '../types';
import { DebugOptions } from '../types';

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
  onUpdate: (reset?: boolean)=>void;
  zIndex: number;
}
