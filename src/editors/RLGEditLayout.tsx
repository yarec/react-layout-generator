import * as React from 'react';

// import Layout from 'src/components/Block';
import { DebugOptions, IPoint, IRect } from '../types';
import { clone } from '../utils';
import { IEditor, IEditorProps, IUndo } from './Editor';
// import RLGContextMenu from './RLGContextMenu';

/**
 * internal use only
 * @ignore
 */
interface IEditHandleProps {
  cursor?: string;
  handle: IRect;
  zIndex: number
}

/**
 * internal use only
 * @ignore
 */
function editStyle(args: IEditHandleProps): React.CSSProperties {
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${args.handle.x}px, ${args.handle.y}px)`,
    width: `${args.handle.width}px`,
    height: `${args.handle.height}px`,
    position: 'absolute' as 'absolute',
    cursor: `${args.cursor}`,
    background: 'rgba(0, 0, 0, 0.0)',
    zIndex: args.zIndex,
    borderWidth: '4px',
    outline: 'none'
  }
}

/**
 * internal use only
 * @ignore
 */
interface IEditLayoutState {
  activateDrag: boolean;
  contextMenu: boolean;
}

/**
 * internal use only
 * @ignore
 */
export class RLGEditLayout extends React.Component<IEditorProps, IEditLayoutState> implements IEditor {
  public _startRect: IRect;
  public _startOrigin: IPoint;

  public _handle: IRect;

  protected _debug: DebugOptions = DebugOptions.none;

  protected _ctrlKey: boolean = false;
  protected _altKey: boolean = false;
  protected _menuLocation: IPoint;

  constructor(props: IEditorProps) {
    super(props);
    this._startRect = clone(this.props.handle);
    this._startOrigin = { x: 0, y: 0 };
    this._menuLocation = { x: 0, y: 0 };
    this.state = { activateDrag: false, contextMenu: false };

    this._handle = {x: 0, y: 0, width: 0, height: 0}
    if (this.props.edit.updateHandle) {
      const r = props.block.rect();
      this._handle = this.props.edit.updateHandle(r);
    }

    if (props.debug) {
      this._debug = props.debug;
    }
  }

  public shouldComponentUpdate(nextProps: IEditorProps, nextState: IEditLayoutState) {
    if (this.props.handle.x - nextProps.handle.x || this.props.handle.y - nextProps.handle.y) {
      return true;
    }
    return false;
  }

  public render = () => {
    if (this._handle) {
      return (
        <div
          id={this.props.block.name}
          style={editStyle({ cursor: this.props.edit.cursor!, handle: this._handle, zIndex: this.props.zIndex })}
          onMouseDown={this.onMouseDown}
          /* onTouchDown={this.onTouchDown} */
          /* onContextMenu={this.onContextMenu} */
          tabIndex={0}
        />

      );
    } else {
      return null;
    }
  }

  public initUpdate(x: number, y: number) {
    this._startOrigin = { x, y };
    const r = this.props.block.rect();
    this._handle = this.props.edit.updateHandle!(r);
    this._startRect = clone(this.props.handle);
  }

  public hideMenu = () => {
    this.setState({ contextMenu: false });
  }

  public moveUpdate(x: number, y: number) {

    let deltaX = x - this._startOrigin.x;
    let deltaY = y - this._startOrigin.y;

    if (this._ctrlKey) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaY = 0;
      } else {
        deltaX = 0;
      }
    }

    if (deltaX || deltaY) {

      // 1 Extend
      const r: IRect = this._startRect;
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

      // tslint:disable-next-line:no-bitwise
      if (this.props.debug && (this.props.debug & DebugOptions.trace)) {
        const name = this.props.block.name;
        console.log(`RLGEditLayout update location ${name} (x: ${r.x}, y: ${r.y}) to (x: ${ur.x} y: ${ur.y})`);
      }

      this.props.block.update({ x: ur.x, y: ur.y }, { width: ur.width, height: ur.height });

      // update params if needed
      if (this.props.edit.updateParam) {
        const p = this.props.edit.updateParam(ur, this.props.edit, this.props.block);
        if (p) {
          this.props.block.generator.params().set(p.name, p.value);
        }
      }

      // 4 Update handle
      this._handle = this.props.edit.updateHandle!(ur);

      this.props.onUpdate();
    }
  }

  public redo = () => {
    // TODO
  };

  public undo = () => {
    // TODO
    console.log('undo');
  };


  public addEventListeners = () => {
    // document.addEventListener('keydown', this.onKeyDown);
    // document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mouseup', this.onHtmlMouseUp);
    document.addEventListener('mousemove', this.onHtmlMouseMove);
    document.addEventListener('touchmove', this.onHtmlTouchMove);
  }

  public removeEventListeners = () => {
    // document.removeEventListener('keydown', this.onKeyDown);
    // document.removeEventListener('keyup', this.onKeyUp);
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

  public onClick = (event: React.MouseEvent) => {
    if (event.altKey) {
      const fn = this.props.block.onClick;
      if (fn) {
        fn(event);
      }
    }
  }

  public onMouseDown = (event: React.MouseEvent) => {
    // tslint:disable-next-line:no-bitwise
    if (this._debug & DebugOptions.mouseEvents) {
      // tslint:disable-next-line:no-string-literal
      console.log(`RLGEditLayout onMouseDown ${event.target['id']}`);
    }

    if (!this.state.contextMenu) {
      // event.preventDefault();
      if (event.button === 2) {
        event.preventDefault();
        // Right click
        const currentTargetRect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.pageX - currentTargetRect.left;
        const offsetY = event.pageY - currentTargetRect.top;
        this._menuLocation = { x: offsetX, y: offsetY };
      } else if (event.shiftKey) {
        // Select
        event.preventDefault();
        event.stopPropagation();
        if (this.props.select) {
          let select: boolean | undefined = true;
          if (this.props.block.position.editor) {
            const editor = this.props.block.position.editor;
            select = editor.selectable;
            if (select === undefined) {
              select = true;
            }
          }
          if (select) {
            const alreadySelected = this.props.select.selected(this.props.block.name);
            if (alreadySelected) {
              this.props.select.remove(this.props.block);
            } else {
              this.props.select.add(this.props.block);
            }

            this.props.onUpdate();
          }
        }
      } else if (event.altKey) {
        const fn = this.props.block.onClick;
        if (fn) {
          fn(event);
        }
      } else {
        event.stopPropagation();
        if (this.props.select) {
          this.props.select.clear();
          this.props.onUpdate();
        }
        this.setState({ contextMenu: false });

        this.addEventListeners();

        this._ctrlKey = event.ctrlKey;
        this._altKey = event.altKey;

        this.initUpdate(event.clientX, event.clientY);
      }
    }
  }

  public onTouchDown = (event: React.TouchEvent) => {
    // https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event
    // Use tap+hold or longtap event to trigger context menu
    // See https://github.com/yahoo/react-dnd-touch-backend 
    // TODO configure RLG to use react-dnd back ends?
  }

  // public onContextMenu = (event: React.MouseEvent) => {
  //   if (event) {
  //     event.preventDefault();
  //     this.setState({ contextMenu: this.props.edit.contextMenu !== undefined });
  //   }
  // }

  public onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      this.moveUpdate(event.clientX, event.clientY);
    }
  }

  public onHtmlMouseUp = (event: MouseEvent) => {
    // tslint:disable-next-line:no-bitwise
    if (this.props.debug && (this.props.debug & DebugOptions.mouseEvents)) {
      // tslint:disable-next-line:no-string-literal
      const id = event && event.target && event.target['id']
      console.log(`RLGEditLayout onHtmlMouseUp ${id ? id : ''}`);
    }

    if (event) {
      event.preventDefault();
      this.removeEventListeners();

      if (this.state.contextMenu) {
        this.setState({ contextMenu: false });
      } else {
        const block = this.props.block;
        const r = block.rect()
        block.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
      }
      this.props.onUpdate(true);
    }
  }

  public onHtmlTouchMove = (event: TouchEvent) => {
    // TODO implement support for touch
  }

  public onKeyDown = (event: KeyboardEvent) => {
    if (event && event.ctrlKey) {
      this.setState({ activateDrag: true })
    }
  }

  public onKeyUp = (event: KeyboardEvent) => {
    if (event && event.ctrlKey) {
      this.setState({ activateDrag: false })
    }
  }

  public componentWillReceiveProps = (props: IEditorProps) => {
    // console.log(`RLGEditLayout componentWillReceiveProps ${props.handle.x} ${props.handle.y}`);
    if (this.props.edit.updateHandle) {
      this._handle = this.props.edit.updateHandle(props.handle);
    }
  }
}