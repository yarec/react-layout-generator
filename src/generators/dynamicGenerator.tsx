import { Block } from '../components/Block';
import { Blocks } from '../components/Blocks';
import { Params, ParamValue } from '../components/Params';
import { Generator, ICreate, IGenerator } from './Generator';

export function dynamicGenerator(
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
      blocks.map.forEach((block: Block) => {
        block.touch();
      });
    }
    return blocks;
  }

  function create(args: ICreate): Block {
    return args.g.blocks().set(args.name, args.dataLayout, args.g);
  }

  return new Generator(name, init, _params, create);
}
