import IValue from './Value'


export default class Params {
  params: Map<string, IValue>;
  _changed: Array<ILayout> = new Array<ILayout>();
  changeCount: number;

  constructor(values: Array<[string, Value]>) {
    this.params = new Map(values);
    this.changeCount = 0;
  }

  changed(): boolean {
    return this.changeCount != 0 || this._changed.length != 0;
  }

  updates(): Array<ILayout> {
    const r: Array<ILayout> = new Array<ILayout>();
    this._changed.forEach((layout) => {
      r.push(layout);
    });
    // Object.assign({}, this._changed);
    this._changed = new Array<ILayout>();
    this.changeCount = 0;
    return r;
  }

  get(key: string) {
    return this.params.get(key);
  }

  touch(layout: ILayout) {
    this._changed.push(layout);
  }

  set(key: string, v: IValue, layout?: ILayout): boolean {
    const r = this.params.get(key);

    // Always push layout 
    if (layout) {
      this._changed.push(layout)
    }

    // Only set if changed
    if (!v.equal(r)) {
      console.log('Param.set ', key);
      this.changeCount += 1;
      this.params.set(key, v);
      return true;
    }
    return false;
  }
}