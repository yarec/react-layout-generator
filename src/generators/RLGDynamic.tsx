import Layout from '../components/Layout';
import Layouts from '../components/Layouts';
import Params, { ParamValue } from '../components/Params';
import Generator, { ICreate, IGenerator } from './Generator';

export default function RLGDynamic(name: string, exParams?: Params, parent?: IGenerator): IGenerator {
  const values: Array<[string, ParamValue]> = [
    ['viewport', { width: 0, height: 0 }]
  ];

  const _params = exParams ? exParams.restore(name, values) : new Params(values);

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
      console.error(`TODO default position ${args.name}`)
    }

    const layout = new Layout(args.name, args.position, args.g);

    args.g.layouts().set(layout.name, layout);

    return layout;
  }

  return new Generator(name, init, _params, create, parent);
}
