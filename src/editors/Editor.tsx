import { Block } from '../components/Block';
import { IEdit } from '../components/blockTypes';
import { Select } from './Select';
import { IRect, EditorOptions } from '../types';
import { DebugOptions } from '../types';


/**
 * internal use only
 * @ignore
 */
export interface IUndo {
  editor: IEditor;
}

/**
 * internal use only
 * @ignore
 */
export interface IEditor {
  push: () => IUndo;
  redo: () => void;
  undo: () => void;
}

/**
 * internal use only
 * @ignore
 */
export interface IEditorProps extends React.HTMLProps<HTMLDivElement> {
  key: string;
  block: Block;
  boundary: IRect;
  debug?: DebugOptions;
  edit: IEdit;
  editor?: EditorOptions;
  handle: IRect;
  select: Select | undefined;
  onUpdate: (reset?: boolean) => void;
  zIndex: number;
}
