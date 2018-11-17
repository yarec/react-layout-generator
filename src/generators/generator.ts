import Params from '../components/Params';
import Layouts from '../components/Layouts';
import Layout, { IPosition } from '../components/Layout'

export type IInit = (g: IGenerator) => Layouts;
export type ICreate = (index: number, name: string, g: IGenerator, position: IPosition) => Layout;

export interface IGenerator {
  name: () => string;
  params: () => Params;
  layouts: () => Layouts;
  reset: () => void;
  next: () => Layout | undefined;
  lookup: (name: string) => Layout | undefined;
  create?: (index: number, name: string, g: IGenerator, position: IPosition) => Layout | undefined;
}

export default class Generator implements IGenerator {
  private _name: string;
  private _params: Params;
  private _layouts: Layouts;
  private _layoutsIterator: IterableIterator<Layout> | undefined;
  private _init: IInit;
  private _create: ICreate | undefined;
  currentLayout: Layout | undefined;

  state: () => Layout | undefined;

  constructor(name: string, init: IInit, params: Params, create?: ICreate) {
    this._name = name;
    this._init = init;
    this._create = create;
    this._layouts = new Layouts([]);
    this._layoutsIterator = this._layouts.values();
    this.state = this.start;
    this._params = params;
  }

  name = () => {
    return this._name;
  }

  params = (): Params => {
    return this._params;
  }

  layouts = (): Layouts => {
    return this._layouts;
  }

  lookup = (name: string): Layout | undefined => {
    return this._layouts.get(name);
  }

  create = (index: number, name: string, g: IGenerator, position: IPosition): Layout | undefined => {
    if (this._create) {
      return this._create(index, name, g, position);
    }
    return undefined;
  }

  reset = () => {

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

  start = (): Layout | undefined => {
    return this.nextBlock();
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
    let b: Layout | undefined = this.currentLayout;
    if (b) {
      this.state = this.nextBlock;
    }

    return b;
  }

  next = (): Layout | undefined => {
    return this.state();
  }
}
