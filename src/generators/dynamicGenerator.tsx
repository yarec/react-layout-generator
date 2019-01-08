import Block from '../components/Block';
import Blocks from '../components/Blocks';
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

  function init(g: IGenerator): Blocks {
    const params = g.params();
    const blocks = g.blocks();

    if (params.changed()) {
      // update Layout for each update
      blocks.map.forEach((block) => {
        block.touch();
      });
    }
    return blocks;
  }

  function create(args: ICreate): Block {

    if (!args.position) {
      console.error(`TODO use default position ${args.name}`)
    }

    return args.g.blocks().set(args.name, args.position, args.g);
  }

  return new Generator(name, init, _params, create);
}