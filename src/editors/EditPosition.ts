import {IEditor, IUndo} from './Editor';
import Layout from 'src/components/Layout';

export default class EditPosition implements IEditor{
  _layout: Layout;

  constructor(layout: Layout) {
    this._layout = layout.clone();
  }

  push = (): IUndo => {

    // this goes on the undo/redo stack
    // the editor is stores the state needed
    // or it will be added to IUndo
    return {editor: this};
  };

  redo: () => {

  };

  undo: () => {

  };

  update: (deltaX: number, deltaY: number) =>  {

  };
}