import Layout from '../components/Layout';
import Layouts from '../components/Layouts';
import Params, { ParamValue } from '../components/Params';
import Generator, { ICreate, IGenerator } from './Generator';

export default function dynamicGenerator(
  name: string,
  exParams?: Params
): IGenerator {
  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }]
  ];

  const _params = exParams ? exParams.restore(name, values) : new Params({
    name: 'dynamicGenerator', initialValues: values
  });

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
      console.error(`TODO use default position ${args.name}`)
    }

    return args.g.layouts().set(args.name, args.position, args.g);
  }

  return new Generator(name, init, _params, create);
}
