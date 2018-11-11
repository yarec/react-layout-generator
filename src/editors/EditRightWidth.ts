import IGenerator from '../generators/Generator';
import { IEditor, IUndo } from './Editor';

export class EditRightWidth implements IEditor {
  g: IGenerator;
  p: Position;
  width: number;

  constructor(p: Position, g: IGenerator) {
  }

  push = (): IUndo => {
    // this goes on the undo/redo stack
    // the editor is stores the state needed
    // or it will be added to IUndo
    return {editor: this};
  }

  redo = () => {

  }
  undo = () => {

  }

  update = (deltaX: number, deltaY: number): void => {

    // pins, and updates value in this.g.positions && this.g.layouts
  }
}