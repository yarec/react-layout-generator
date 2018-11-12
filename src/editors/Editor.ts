
export interface IUndo {
  editor: IEditor;
}

export interface IEditor {
  push: () => IUndo;
  redo: () => void;
  undo: () => void;
  update: (deltaX: number, deltaY: number) => void;
}