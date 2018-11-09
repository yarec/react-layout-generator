import Params from './Params';
import {ILayout} from './Layout';

export interface IGenerator {
  name: () => string;
  params: () => Params;
  reset: () => void;
  next: () => ILayout | undefined;
  lookup: (name: string) => ILayout | undefined;
  layouts: () => Layouts | undefined;
  create?: (index: number, name: string, g: IGenerator, position: IPosition) => ILayout | undefined;
  api: () => API | undefined;
}

export default class BasicLayoutGenerator implements IGenerator {
  private _name: string;
  private _params: Params;
  private _api: API | undefined;
  private _init: IInit;
  private _create: ICreate | undefined;
  private _layouts: Layouts;
  private _layoutsIterator: IterableIterator<ILayout> | undefined;
  currentLayout: ILayout | undefined;

  state: () => ILayout | undefined;

  constructor(name: string, init: IInit, params: Params, create?: ICreate, api?: API) {
    this._name = name;
    this._init = init;
    this._create = create;
    this._layouts = new Layouts([]); // init(params);
    this._layoutsIterator = this._layouts.values();
    this.state = this.init;
    this._params = params;
    this._api = api;
  }

  name = () => {
    return this._name;
  }

  params = () => {
    return this._params;
  }

  layouts = () => {
    return this._layouts;
  }

  api = () => {
    return this._api;
  }

  lookup = (name: string): ILayout | undefined => {
    let r = this._layouts.get(name);
    if (r) {
      if (r.g) {
        let n = r.g.lookup(name);
        if (n) {
          return Object.assign({}, n);
        }
      }
      return Object.assign({}, r);
    }
    return undefined;
  }

  create = (index: number, name: string, g: ILayoutGenerator, position: IPosition): ILayout | undefined => {
    if (this._create) {
      return this._create(index, name, g, position);
    }
    return undefined;
  }

  reset = () => {
    // const changed: Array<ILayout> = this._params.changed();
    if (this._params.changed() || this._layouts.size === 0) {
      // console.log('reset update layouts')
      this._layouts = this._init(this._params, this._layouts); // unless external
    }
    this.state = this.init;
    this._layoutsIterator = this._layouts.values();
    this._layouts.layouts.forEach((item: ILayout) => {
      if (item.g) {
        item.g.reset();
      }
    })
  }

  init = (): ILayout | undefined => {
    return this.nextBlock();
  }

  private nextBlock = (): ILayout | undefined => {
    this.currentLayout = this._layoutsIterator!.next().value;
    if (this.currentLayout) {
      if (this.currentLayout.g) {
        this.state = this.nestedBlock;
        return this.nestedBlock();
      } else {
        this.state = this.nextTile;
        return this.nextTile();
      }

    } else {
      this.state = this.init;
      return undefined;
    }
  }

  private nestedBlock = (): ILayout | undefined => {
    let b: ILayout | undefined = undefined;
    if (this.currentLayout && this.currentLayout.g) {
      b = this.currentLayout.g.next();
    }
    if (b === undefined) {
      this.state = this.nextBlock;
      return this.nextBlock();
    }
    return b;
  }

  private nextTile = (): ILayout | undefined => {
    let b: ILayout | undefined = undefined;
    if (this.currentLayout) {
      const r = this.currentLayout.location;
      b = {
        name: this.currentLayout.name,
        location: r
      }
      this.state = this.nextBlock;
    }

    return b;
  }

  next = (): ILayout | undefined => {
    return this.state();
  }
}
