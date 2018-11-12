import Layout from './Layout';

export default class Layouts {
  private _layouts: Map<string, Layout>;
  private _byIndex: Array<Layout>;
  // width: number;
  // height: number;

  constructor(layouts: Array<[string, Layout]>) {
    this._byIndex = new Array();
    this._layouts = new Map(layouts);
    this._layouts.forEach((value) => {
      this._byIndex.push(value);
    })
  }

  // update() {
  //   this.width = 0;
  //   this.height = 0;

  //   Get actual width and height
  //   this._layouts.forEach((layout) => {
  //     if (this.width < layout.location.right) {
  //       this.width = layout.location.right
  //     }
  //     if (this.height < layout.location.bottom) {
  //       this.height = layout.location.bottom
  //     }
  //   });
  // }

  values() {
    return this._layouts.values();
  }

  get layouts() {
    return this._layouts;
  }

  get size() {
    return this._layouts.size;
  }

  find(i: number) {
    return this._byIndex[i];
  }

  get(key: string) {
    return this._layouts.get(key);
  }

  set(key: string, v: Layout) {
    const s = this._layouts.size;
    if (this._layouts.set(key, v)) {
      if (s < this._layouts.size) {
        // Add to byIndex array
        this._byIndex.push(v);
      }
    }
  }
}
