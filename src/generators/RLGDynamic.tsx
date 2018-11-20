import Generator, { IGenerator, ICreate } from './Generator';
import Layouts from '../components/Layouts';
import Layout from '../components/Layout';
import Params from '../components/Params';

export default function RLGDynamic(name: string): IGenerator {
  const params = new Params([
    ['viewport', { width: 0, height: 0 }]
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

    if (!args.position) {
      console.error('TODO default position')
    }

    const box = new Layout(name, args.position, args.g);

    args.g.layouts().set(name, box);

    return box;
  }

  return new Generator(name, init, params, create);
}
