export enum PositionRef {
  position = 1,
  position_height_top,
  position_height_bottom,
  position_width_left,
  position_width_right,
  position_point_left_top,
  position_point_right_top,
  position_point_left_bottom,
  position_point_right_bottom
};

export interface IUndo {
  editor: IEditor;
}

export interface IEditor {
  push: () => IUndo;
  redo: () => void;
  undo: () => void;
  update: (deltaX: number, deltaY: number) => void;
}