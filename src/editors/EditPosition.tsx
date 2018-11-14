import * as React from 'react';
import { EditorProps, IEditor, IUndo } from './Editor';
import Layout from 'src/components/Layout';
import { IPoint } from 'src/types';
import { Rect } from 'lib/src/types';

interface editHandleProps {
  cursor: string;
  handle: Rect;
}

function editStyle(props: editHandleProps): React.CSSProperties {
  //  console.log('editStyle', props.x, props.y, props.width, props.height);

  // console.log(style);
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${props.handle.left}px, ${props.handle.top}px)`,
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
  _layout: Layout;
  _origin: IPoint;

  _cursor: string;
  _handle: Rect;

  constructor(props: EditorProps) {
    super(props);
    this._layout = this.props.layout.clone();
    this._origin = { x: 0, y: 0 };
  }

  initUpdate(x: number, y: number) {
    this._origin = { x: x, y: y };
  }

  moveUpdate(x: number, y: number) {

    const deltaX = x - this._origin.x;
    const deltaY = y - this._origin.y;

    if (deltaX || deltaY) {

      const r = this._layout.rect();

      r.x += deltaX;
      r.y += deltaY;

      // 2 Pin


      // 3 Make live
      const l = this._layout.name;
      const layout = this._layout.generator.layouts().get(l);

      layout!.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
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
      // console.log('onMouseMove', event.clientX, event.clientY);
    }
  }

  onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.removeEventListeners();
      // console.log('onMouseUp', event.clientX, event.clientY);
    }
  }

  onHtmlTouchMove = (event: TouchEvent) => {
    // TODO implement support for touch
  }

  render = () => {
    return (
      <div
        style={editStyle({cursor: this._cursor, handle: this._handle})}
        onMouseDown={this.onMouseDown}
      />
    );
  }

}