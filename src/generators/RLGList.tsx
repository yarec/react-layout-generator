import Layout, {IUnit} from '../components/Layout';
import Layouts from '../components/Layouts';
import Params from '../components/Params';
import Generator, {ICreate, IGenerator} from '../generators/Generator';
import { ISize } from '../types';

export default function RLGList(name: string, parent?: IGenerator) {

  const _titleHeight = 34;
  const _itemHeight = 24;

  const _params = new Params([
    ['viewport', {width: 0, height: 0}],
    ['titleHeight', _titleHeight],
    ['itemHeight', _itemHeight]
  ])

  function init(g: IGenerator): Layouts {
    
    const params = g.params();
    const layouts = g.layouts();

    if (params.changed()) {
      // update Layout for each update
      layouts.map.forEach((layout) => {
        layout.touch();
      });
    }

    return layouts;
  }

  function create(args: ICreate): Layout {
    const params = args.g.params();
    const viewport = params.get('viewport') as ISize;
    const titleHeight = params.get('titleHeight') as number;
    const itemHeight = params.get('itemHeight') as number;

    let p = args.position;
    if (!p) {
      p = {
        units: {
          origin: {x: 0, y: 0},
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        align: {
          key: args.index-1,
          offset: {x: 0, y: 0},
          source: {x: 0, y: 100},
          self: {x: 0, y: 0}
        },
        location: {x: 5, y: 0},
        size: {width: viewport.width, height: args.index === 0? titleHeight : itemHeight}
      }
    }

    const l = new Layout(name, p, args.g);

    args.g.layouts().set(name, l);

    return l;
  }

  return new Generator(name, init, _params, create, parent);
}