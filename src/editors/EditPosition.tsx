import * as React from 'react';
import { EditorProps, IEditor, IUndo } from './Editor';
import Layout from 'src/components/Layout';
import { IPoint, IRect } from 'src/types';


interface editHandleProps {
  cursor: string;
  handle: IRect;
}

function editStyle(props: editHandleProps): React.CSSProperties {
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${props.handle.x}px, ${props.handle.y}px)`,
    width: `${props.handle.width}px`,
    height: `${props.handle.height}px`,
    position: 'absolute' as 'absolute',
    cursor: props.cursor,
    background: 'rgba(0, 0, 0, 0.0)',
    zIndex: 1000,
    borderWidth: '4px'
  }
}

export default class EditPosition extends React.Component<EditorProps, {}> implements IEditor {
  _clonedLayout: Layout;
  _startOrigin: IPoint;

  _handle: IRect;

  constructor(props: EditorProps) {
    super(props);
    this._clonedLayout = this.props.layout.clone();
    this._startOrigin = { x: 0, y: 0 };
    this._handle = props.layout.rect();
  }

  initUpdate(x: number, y: number) {
    this._startOrigin = { x: x, y: y };
  }

  moveUpdate(x: number, y: number) {

    const deltaX = x - this._startOrigin.x;
    const deltaY = y - this._startOrigin.y;

    if (deltaX || deltaY) {

      console.log(`moveUpdate ${deltaX} ${deltaY}`)

      // 1 Extend
      const r: IRect = this._clonedLayout.rect();
      let ur: IRect = this.props.edit.extendElement!(r, deltaX, deltaY);

      // 2 Pin
      

      // 3 Make live
      const name = this._clonedLayout.name;
      const layout = this._clonedLayout.generator.layouts().get(name);

      layout!.update({ x: ur.x, y: ur.y }, { width: ur.width, height: ur.height });

      // 4 Update handle
      this._handle = this.props.edit.updateHandle!(ur);

      this.props.onUpdate();
    }
  }

  addEventListeners = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp);
    document.addEventListener('mousemove', this.onHtmlMouseMove);
    document.addEventListener('touchmove', this.onHtmlTouchMove);
  }

  removeEventListeners = () => {
    document.removeEventListener('mouseup', this.onHtmlMouseUp);
    document.removeEventListener('mousemove', this.onHtmlMouseMove);
    document.removeEventListener('touchmove', this.onHtmlTouchMove);
  }

  push = (): IUndo => {

    // this goes on the undo/redo stack
    // the editor is stores the state needed
    // or it will be added to IUndo
    return { editor: this };
  };

  redo: () => {

  };

  undo: () => {

  };

  onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.addEventListeners();
      this.initUpdate(event.clientX, event.clientY);
    }
  }

  onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.moveUpdate(event.clientX, event.clientY);
    }
  }

  onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.removeEventListeners();
    }
  }

  onHtmlTouchMove = (event: TouchEvent) => {
    // TODO implement support for touch
  }

  render = () => {
    return (
      <div
        style={editStyle({cursor: this.props.edit.cursor!, handle: this._handle})}
        onMouseDown={this.onMouseDown}
      />
    );
  }

}