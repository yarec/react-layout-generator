import { ISize } from 'src/types';
import Layout, { IPosition } from '../components/Layout'
import Layouts from '../components/Layouts';
import Params from '../components/Params';

export type IInit = (g: IGenerator) => Layouts;
export interface ICreate {
  index: number,
  count: number,
  name: string,
  g: IGenerator,
  position: IPosition
}

export type Create = (args: ICreate) => Layout | undefined;

export interface IGenerator {
  name: () => string;
  params: () => Params;
  layouts: () => Layouts;
  reset: () => void;
  next: () => Layout | undefined;
  lookup: (name: string) => Layout | undefined;
  viewport: (name: string) => ISize | undefined;
  clear: () => void;
  create?: Create;
  parent?: () => IGenerator | undefined;
}

export default class Generator implements IGenerator {
  public currentLayout: Layout | undefined;

  public state: () => Layout | undefined;
  private _name: string;
  private _params: Params;
  private _layouts: Layouts;
  private _layoutsIterator: IterableIterator<Layout> | undefined;
  private _init: IInit;
  private _create: Create | undefined;
  private _parent: IGenerator | undefined;

  constructor(name: string, init: IInit, params: Params, create?: Create, parent?: IGenerator) {
    this._name = name;
    this._init = init;
    this._create = create;
    this._layouts = new Layouts([]);
    this._layoutsIterator = this._layouts.values();
    this.state = this.start;
    this._params = params;
    this._parent = parent;
  }

  public name = () => {
    return this._name;
  }

  public params = (): Params => {
    return this._params;
  }

  public layouts = (): Layouts => {
    return this._layouts;
  }

  public lookup = (name: string): Layout | undefined => {
    return this._layouts.get(name);
  }

  public viewport = (name: string): ISize => {
    const l = this._layouts.get(name);
    if (l) {
      const r = l.rect();
      
      return {width: r.width, height: r.height};
    }
    
    return {width: 0, height: 0};
  }

  public create = (args: ICreate): Layout | undefined => {
    if (this._create) {
      return this._create(args);
    }
    return undefined;
  }

  public parent = (): IGenerator | undefined => {
    return this._parent;
  }


  public reset = () => {

    // console.log('reset update layouts')
    this._layouts = this._init(this);
    this.state = this.start;
    this._layoutsIterator = this._layouts.values();
    // this._layouts.layouts.forEach((item: Layout) => {
    //   if (item.g) {
    //     item.g.reset();
    //   }
    // })
  }

  public clear = () => {
    this._layouts = new Layouts([]);
    this.state = this.start;
    this._layoutsIterator = this._layouts.values();
  }

  public start = (): Layout | undefined => {
    return this.nextBlock();
  }

  public next = (): Layout | undefined => {
    return this.state();
  }

  private nextBlock = (): Layout | undefined => {
    this.currentLayout = this._layoutsIterator!.next().value;
    if (this.currentLayout) {
      // if (this.currentLayout.g) {
      //   this.state = this.nestedBlock;
      //   return this.nestedBlock();
      // } else {
      this.state = this.nextTile;
      return this.nextTile();
      // }

    } else {
      this.state = this.start;
      return undefined;
    }
  }

  // private nestedBlock = (): Layout | undefined => {
  //   let b: Layout | undefined = undefined;
  //   if (this.currentLayout && this.currentLayout.g) {
  //     b = this.currentLayout.g.next();
  //   }
  //   if (b === undefined) {
  //     this.state = this.nextBlock;
  //     return this.nextBlock();
  //   }
  //   return b;
  // }

  private nextTile = (): Layout | undefined => {
    const b: Layout | undefined = this.currentLayout;
    if (b) {
      this.state = this.nextBlock;
    }

    return b;
  }
}
