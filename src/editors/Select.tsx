import * as React from 'react';

import { Block } from '../components/Block';
import { IMenuItem } from '../components/blockTypes';
import { IGenerator } from '../generators/Generator';
import { DebugOptions, IRect } from '../types';
import { clone } from '../utils';
import {EditHelper, ICommand, Status} from './EditHelper';
import { ParamValue } from '../components/Params';

/**
 * internal use only
 * @ignore
 */
export interface ISelectProps {
  name: string;
  boundary: IRect;
  debug?: DebugOptions;
  selectCallback: (instance: Select) => void;
  onUpdate: (reset?: boolean) => void;
  g: IGenerator;
}

/**
 * internal use only
 * @ignore
 */
export interface ISelectState {
  contextMenu: boolean; 
}

/**
 * internal use only
 * @ignore
 */
interface ISavedPosition {
  name: string;
  value: IRect;
}

/**
 * internal use only
 * @ignore
 */
type IUndoRedo = ISavedPosition[];

/**
 * internal use only
 * @ignore
 */
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

/**
 * internal use only
 * @ignore
 */
// tslint:disable-next-line:max-classes-per-file
export class Select extends React.Component<ISelectProps, ISelectState> {

  private _editHelper: EditHelper | undefined;
  private _selected: Map<string, Block> = new Map([]);
  private _undo: IUndoRedo[] = [];
  private _redo: IUndoRedo[] = [];

  constructor(props: ISelectProps) {
    super(props);
    // set instance
    this.props.selectCallback(this);

    this._editHelper = this.props.g.editor &&  this.props.g.editor();

    this.state = { contextMenu: false };
  }

  public addEventListeners = () => {
    document.addEventListener('keydown', this.onKeyDown);
    // // document.addEventListener('keyup', this.onKeyUp);
    // document.addEventListener('mouseup', this.onHtmlMouseUp);
    // document.addEventListener('mousemove', this.onHtmlMouseMove);
    // document.addEventListener('touchmove', this.onHtmlTouchMove);
  }

  public removeEventListeners = () => {
    document.removeEventListener('keydown', this.onKeyDown);
    // document.removeEventListener('keyup', this.onKeyUp);
    // document.removeEventListener('mouseup', this.onHtmlMouseUp);
    // document.removeEventListener('mousemove', this.onHtmlMouseMove);
    // document.removeEventListener('touchmove', this.onHtmlTouchMove);
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

    this.addEventListeners();
  }

  public componentWillUnmount() {
    this.removeEventListeners();
  }

  public onKeyDown = (event: KeyboardEvent) => {
    if (event ) {
      switch(event.key) {
        case 'p': {
          if (event.altKey && event.ctrlKey) {
            this.dumpParams();
          }
        }
      } 
    }
  }

  public dumpParams() {
    const params = this.props.g.params();

    console.log(`Params ------------------------------------`)
    console.log(`"${this.props.g.name()}": [`)
    params.map.forEach((value: ParamValue, key: string) => {
      console.log(` ["${key}", ${JSON.stringify(value)}],`)
    })
    console.log(`]`)
    console.log(`End Params --------------------------------`)
  }

  public get commands() {

    const disabled = this._selected.size > 1 ? false : true;
    const disabled2 = this._selected.size > 0 ? false : true;

    const menuCommands: IMenuItem[] = [
      { name: 'undo', disabled: this._undo.length ? false : true, command: this.undo },
      { name: 'redo', disabled: this._redo.length ? false : true, command: this.redo },
      { name: '' },
      { name: 'align left', disabled, command: this.alignLeft },
      { name: 'align center', disabled, command: this.alignCenter },
      { name: 'align right', disabled, command: this.alignRight },
      { name: '' },
      { name: 'align top', disabled, command: this.alignTop },
      { name: 'align middle', disabled, command: this.alignMiddle },
      { name: 'align bottom', disabled, command: this.alignBottom },
      { name: '' },
      { name: 'bring forward',  disabled: disabled2, command: this.bringForward },
      { name: 'send backward',  disabled: disabled2, command: this.sendBackward },
      { name: 'bring front',  disabled: disabled2, command: this.bringFront },
      { name: 'send back',  disabled: disabled2, command: this.sendBack },
    ];

    return menuCommands;
  }

  public selected = (name: string) => {
    return this._selected.get(name) !== undefined;
  }

  public select = (name: string) => {
    const block = this.props.g.blocks().get(name);
    if (block) {
      this._selected.set(name, block)
      return block
    }
    return undefined
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
    const blocks = this.props.g.blocks();
    const oldData: IUndoRedo = []; 
    data.forEach((saved: ISavedPosition) => {
      const block = blocks.get(saved.name);
      if (block) {
        oldData.push({name: saved.name, value: clone(block.rect)});
        const r = saved.value;
        console.log(`Select restore ${saved.name} ${saved.value.x} ${saved.value.y}`);
        block.update({ x: r.x, y: r.y, width: r.width, height: r.height });
        this._selected.set(block.name, block);
      }
    });
    this.props.onUpdate();
    return oldData;
  }

  public add(block: Block) {
    this._selected.set(block.name, block);
  }

  public remove(block: Block) {
    this._selected.delete(block.name);
  }

  public clear() {
    this._selected.clear();
    if (this._editHelper) {
      this._editHelper.clear();
    }
    this.props.onUpdate();
  }

  public pushRectState = () => {
    const data: IUndoRedo = []
    this._selected.forEach((block: Block) => {
      // save a clone of block.rect
      data.push({ name: block.name, value: clone(block.rect) });
    })
    this._undo.push(data);
  }

  public alignCenter = () => {
    let center: number;

    this.pushRectState();

    this._selected.forEach((block: Block) => {
      const r = block.rect;
      if (center === undefined) {
        center = r.x + .5 * r.width;
      } else {
        block.update({ x: center - r.width / 2, y: r.y, width: r.width, height: r.height })
      }
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignMiddle = () => {
    let middle: number;

    this.pushRectState();

    this._selected.forEach((block: Block) => {
      const r = block.rect;
      if (middle === undefined) {
        middle = r.y + .5 * r.height;
      } else {
        block.update({ x: r.x, y: middle - r.height / 2, width: r.width, height: r.height })
      }
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignTop = () => {
    let top: number;

    this.pushRectState();

    this._selected.forEach((block: Block) => {
      const r = block.rect;
      if (top === undefined) {
        top = r.y;
      }
      block.update({ x: r.x, y: top, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignLeft = () => {
    let left: number;

    this.pushRectState();

    this._selected.forEach((block: Block) => {
      const r = block.rect;
      if (left === undefined) {
        left = r.x;
      }
      block.update({ x: left, y: r.y, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignBottom = () => {
    let bottom: number;

    this.pushRectState();

    this._selected.forEach((block: Block) => {
      const r = block.rect;
      if (bottom === undefined) {
        bottom = r.y + r.height;
      }
      block.update({ x: r.x, y: bottom - r.height, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignRight = () => {
    let right: number;

    this.pushRectState();

    this._selected.forEach((block: Block) => {
      const r = block.rect;
      if (right === undefined) {
        right = r.x + r.width;
      }
      block.update({ x: right - r.width, y: r.y, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public bringForward = () => {
    const stacking = this.props.g.stacking();

    this._selected.forEach((block: Block) => {
      stacking.bringForward(block)
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public sendBackward = () => {
    const stacking = this.props.g.stacking();

    this._selected.forEach((block: Block) => {
      stacking.sendBackward(block)
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public bringFront = () => {
    const stacking = this.props.g.stacking();

    stacking.bringFront(this.selectedBlocks())
    if (this._selected.size) {
      this.props.onUpdate();
    }
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public sendBack = () => {
    const stacking = this.props.g.stacking();
    stacking.sendBack(this.selectedBlocks())
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public render() {
    return (
      <div
        key={'select'}
        id={'select'}
        style={{
          background: 'transparent',
          position: 'absolute',
          width: this.props.boundary.width,
          height: this.props.boundary.height
        }}
      />
    );

  }

  private selectedBlocks() {
    const b: Block[] = []
    this._selected.forEach((value) => {
      b.push(value)
    })
    return b;
  }

  // public minMax() {
  //   let min = Number.MAX_SAFE_INTEGER
  //   let max = Number.MIN_SAFE_INTEGER

  //   this.props.g.blocks().map.forEach((block: Block) => {
  //     if (block.layer < min) {
  //       min = block.layer
  //     }
  //     if (block.layer > max) {
  //       max = block.layer
  //     }
  //   })

  //   return {min, max}
  // }
}