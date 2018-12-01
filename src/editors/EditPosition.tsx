import * as React from 'react';
import Layout from 'src/components/Layout';
import { IPoint, IRect } from 'src/types';
import { IEditor, IEditorProps, IUndo } from './Editor';


interface IEditHandleProps {
  cursor: string;
  handle: IRect;
}

function editStyle(props: IEditHandleProps): React.CSSProperties {
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

export default class EditPosition extends React.Component<IEditorProps, {}> implements IEditor {
  public _clonedLayout: Layout;
  public _startOrigin: IPoint;

  public _handle: IRect;

  public redo: () => {

  };

  public undo: () => {

  };

  constructor(props: IEditorProps) {
    super(props);
    this._clonedLayout = this.props.layout.clone();
    this._startOrigin = { x: 0, y: 0 };
    if (this.props.edit.updateHandle) {
      const r = props.layout.rect();
      this._handle = this.props.edit.updateHandle(r);
    }
  }

  public initUpdate(x: number, y: number) {
    this._startOrigin = { x, y };
  }

  public moveUpdate(x: number, y: number) {

    const deltaX = x - this._startOrigin.x;
    const deltaY = y - this._startOrigin.y;

    if (deltaX || deltaY) {

      // 1 Extend
      const r: IRect = this._clonedLayout.rect();
      const ur: IRect = this.props.edit.extendElement!(r, deltaX, deltaY);

      // 2 Pin
      if (ur.x < this.props.boundary.x) {
        ur.x = this.props.boundary.x;
      }

      if ((ur.x + ur.width) > (this.props.boundary.x + this.props.boundary.width)) {
        ur.x = this.props.boundary.x + this.props.boundary.width - ur.width;
      }

      if (ur.y < this.props.boundary.y) {
        ur.y = this.props.boundary.y;
      }

      if ((ur.y + ur.height) > (this.props.boundary.y + this.props.boundary.height)) {
        ur.y = this.props.boundary.y + this.props.boundary.height - ur.height;
      }

      // 3 Make live
      const name = this._clonedLayout.name;
      const layout = this._clonedLayout.generator.layouts().get(name);

      layout!.update({ x: ur.x, y: ur.y }, { width: ur.width, height: ur.height });

      // update params if needed
      if (this.props.edit.updateParam) {
        const p = this.props.edit.updateParam(ur, this.props.edit);
        if (p) {
          layout!.generator.params().set(p.name, p.value);
        }
      }

      // 4 Update handle
      this._handle = this.props.edit.updateHandle!(ur);

      this.props.onUpdate();
    }
  }

  public addEventListeners = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp);
    document.addEventListener('mousemove', this.onHtmlMouseMove);
    document.addEventListener('touchmove', this.onHtmlTouchMove);
  }

  public removeEventListeners = () => {
    document.removeEventListener('mouseup', this.onHtmlMouseUp);
    document.removeEventListener('mousemove', this.onHtmlMouseMove);
    document.removeEventListener('touchmove', this.onHtmlTouchMove);
  }

  public push = (): IUndo => {

    // this goes on the undo/redo stack
    // the editor is stores the state needed
    // or it will be added to IUndo
    return { editor: this };
  };

  public onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.addEventListeners();
      this.initUpdate(event.clientX, event.clientY);
    }
  }

  public onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.moveUpdate(event.clientX, event.clientY);
    }
  }

  public onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.removeEventListeners();

      const layout = this._clonedLayout.generator.lookup(this._clonedLayout.name)!;
      const r = layout.rect()
      layout.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
      this._clonedLayout = layout.clone();

      this.props.onUpdate(true);
    }
  }

  public onHtmlTouchMove = (event: TouchEvent) => {
    // TODO implement support for touch
  }

  public render = () => {
    return (
      <div
        style={editStyle({ cursor: this.props.edit.cursor!, handle: this._handle })}
        onMouseDown={this.onMouseDown}
      />
    );
  }

}