import Generator, { IGenerator, } from '../generators/Generator';
import { ISize } from '../types';
import Params from '../components/Params';
import Layouts from '../components/Layouts';
import Layout, {IPosition, IUnit} from '../components/Layout';

export default function RLGList(name: string) {

  const titleHeight = 34;
  const itemHeight = 24;

  const params = new Params([
    ['viewport', {width: 0, height: 0}],
    ['titleHeight', titleHeight],
    ['itemHeight', itemHeight]
  ])

  function init(g: IGenerator): Layouts {
    
    const params = g.params();
    const layouts = g.layouts();

    if (params.changed()) {
      // update Layout for each update
      layouts.layouts.forEach((layout) => {
        layout.touch();
      });
    }

    return layouts;
  }

  function create(index: number, name: string, g: IGenerator, position: IPosition): Layout {
    const params = g.params();
    const viewport = params.get('viewport') as ISize;
    const titleHeight = params.get('titleHeight') as number;
    const itemHeight = params.get('itemHeight') as number;

    let p = position;
    if (!p) {
      p = {
        units: {
          origin: {x: 0, y: 0},
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        align: {
          key: index-1,
          offset: {x: 0, y: 0},
          source: {x: 0, y: 100},
          self: {x: 0, y: 0}
        },
        location: {x: 0, y: 0},
        size: {width: viewport.width, height: index === 0? titleHeight : itemHeight}
      }
    }

    return new Layout(name, p, g);
  }

  return new Generator(name, init, params, create);
}