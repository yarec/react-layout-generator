import { Block, IEdit } from '../components/Block';
import { RLGSelect } from '../editors/RLGSelect';
import { IRect } from '../types';
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
  handle: IRect;
  select: RLGSelect | undefined;
  onUpdate: (reset?: boolean) => void;
  zIndex: number;
}
