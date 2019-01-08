import * as React from 'react';

import Block, { IMenuItem } from '../components/Block';
import { IGenerator } from '../generators/Generator';
import { DebugOptions, IRect } from '../types';
import { clone } from '../utils';
import EditHelper, {ICommand, Status} from './EditHelper';
// import RLGContextMenu from './RLGContextMenu';

export interface IRLGSelectProps {
  name: string;
  boundary: IRect;
  debug?: DebugOptions;
  select: (instance: RLGSelect) => void;
  onUpdate: (reset?: boolean) => void;
  g: IGenerator;
}

export interface IRLGSelectState {
  contextMenu: boolean;
}

interface ISavedPosition {
  name: string;
  value: IRect;
}

type IUndoRedo = ISavedPosition[];

export interface IMenuItem {
  name: string;
  disabled?: boolean;
  checked?: boolean;
  command?: () => void;

}

class Command implements ICommand {
  
  public name: string;
  public command: (status: Status) => Status | undefined;
  public status: (() => Status) | Status | undefined; 

  private _menuItem: IMenuItem;

  constructor(menuItem: IMenuItem) {
    this._menuItem = menuItem;
    this.name = menuItem.name;
    this.command = this.wrappedCommand;
    this.status = this.wrappedStatus;
  }

  private wrappedStatus = () => {
    if (!this._menuItem.disabled) {
      return Status.down;
    }
    if (this._menuItem.checked) {
      return Status.up;
    }
    return Status.disabled;
  }

  private wrappedCommand = (status: Status) => {

    if (this._menuItem.command) {
      this._menuItem.command();
    }

    return this.wrappedStatus();
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class RLGSelect extends React.Component<IRLGSelectProps, IRLGSelectState> {

  private _editHelper: EditHelper | undefined;
  private _selected: Map<string, Block> = new Map([]);
  private _undo: IUndoRedo[] = [];
  private _redo: IUndoRedo[] = [];

  constructor(props: IRLGSelectProps) {
    super(props);
    // set instance
    this.props.select(this);

    this._editHelper = this.props.g.editor &&  this.props.g.editor();

    this.state = { contextMenu: false };
  }

  public componentDidMount() {
    if (this._editHelper) {
      const commands: ICommand[] = [];
      const menus = this.commands;
      menus.forEach((item: IMenuItem) => {
        const cmd = new Command(item);
        commands.push(cmd);
      });
      this._editHelper.load(commands);
    }
  }

  public get commands() {

    const disabled = this._selected.size > 1 ? false : true;
    const menuCommands: IMenuItem[] = [
      { name: 'undo', disabled: this._undo.length ? false : true, command: this.undo },
      { name: 'redo', disabled: this._redo.length ? false : true, command: this.redo },
      { name: '' },
      { name: 'alignLeft', disabled, command: this.alignLeft },
      { name: 'alignCenter', disabled, command: this.alignCenter },
      { name: 'alignRight', disabled, command: this.alignRight },
      { name: '' },
      { name: 'alignTop', disabled, command: this.alignTop },
      { name: 'alignMiddle', disabled, command: this.alignMiddle },
      { name: 'alignBottom', disabled, command: this.alignBottom },
    ];

    return menuCommands;
  }

  public selected = (name: string) => {
    return this._selected.get(name) !== undefined;
  }

  public undo = () => {
    if (this._undo.length) {
      const data = this._undo.pop() as IUndoRedo;

      if (data) {


        // restore data
        const oldData = this.restore(data);

        this._redo.push(oldData);
      }
    }
  }

  public redo = () => {
    if (this._redo.length) {
      const data = this._redo.pop();

      if (data) {
        // restore data
        const oldData = this.restore(data);

        this._undo.push(oldData);
      }
    }
  }

  public restore = (data: IUndoRedo) => {
    this._selected.clear();
    const layouts = this.props.g.layouts();
    const oldData: IUndoRedo = []; 
    data.forEach((saved: ISavedPosition) => {
      const layout = layouts.get(saved.name);
      if (layout) {
        oldData.push({name: saved.name, value: clone(layout.rect())});
        const r = saved.value;
        console.log(`Select restore ${saved.name} ${saved.value.x} ${saved.value.y}`);
        layout.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
        this._selected.set(layout.name, layout);
      }
    });
    this.props.onUpdate();
    return oldData;
  }

  public add(layout: Block) {
    this._selected.set(layout.name, layout);
  }

  public remove(layout: Block) {
    this._selected.delete(layout.name);
  }

  public clear() {
    this._selected.clear();
    if (this._editHelper) {
      this._editHelper.clear();
    }
    this.props.onUpdate();
  }

  public pushState = () => {
    const data: IUndoRedo = []
    this._selected.forEach((layout: Block) => {
      // save a clone of layout.rect
      data.push({ name: layout.name, value: clone(layout.rect()) });
    })
    this._undo.push(data);
  }

  public alignCenter = () => {
    let center: number;

    this.pushState();

    this._selected.forEach((layout: Block) => {
      const r = layout.rect();
      if (center === undefined) {
        center = r.x + .5 * r.width;
      } else {
        layout.update({ x: center - r.width / 2, y: r.y }, { width: r.width, height: r.height })
      }
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignMiddle = () => {
    let middle: number;

    this.pushState();

    this._selected.forEach((layout: Block) => {
      const r = layout.rect();
      if (middle === undefined) {
        middle = r.y + .5 * r.height;
      } else {
        layout.update({ x: r.x, y: middle - r.height / 2 }, { width: r.width, height: r.height })
      }
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignTop = () => {
    let top: number;

    this.pushState();

    this._selected.forEach((layout: Block) => {
      const r = layout.rect();
      if (top === undefined) {
        top = r.y;
      }
      layout.update({ x: r.x, y: top }, { width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignLeft = () => {
    let left: number;

    this.pushState();

    this._selected.forEach((layout: Block) => {
      const r = layout.rect();
      if (left === undefined) {
        left = r.x;
      }
      layout.update({ x: left, y: r.y }, { width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignBottom = () => {
    let bottom: number;

    this.pushState();

    this._selected.forEach((layout: Block) => {
      const r = layout.rect();
      if (bottom === undefined) {
        bottom = r.y + r.height;
      }
      layout.update({ x: r.x, y: bottom - r.height }, { width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignRight = () => {
    let right: number;

    this.pushState();

    this._selected.forEach((layout: Block) => {
      const r = layout.rect();
      if (right === undefined) {
        right = r.x + r.width;
      }
      layout.update({ x: right - r.width, y: r.y }, { width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public render() {
    return (
      <div
        key={'select'}
        style={{
          background: 'transparent',
          position: 'absolute',
          width: this.props.boundary.width,
          height: this.props.boundary.height
        }}
      />
    );

  }
}