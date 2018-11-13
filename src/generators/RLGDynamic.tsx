import Generator, { IGenerator } from './Generator';
import Layouts from '../components/Layouts';
import Layout, {IPosition} from '../components/Layout';
import Params from '../components/Params';

export default function RLGDiagram(name: string) {
  const params = new Params([
    ['viewport', {width: 0, height: 0}]
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

    if (!position) {
      console.error('TODO default position')
    }

    const box = new Layout('test', position, g);
    
    const layouts = g.layouts();
    if (layouts) {
      layouts.set(name, box);
    }
    return box;
  }

  return new Generator(name, init, params, create);
}
