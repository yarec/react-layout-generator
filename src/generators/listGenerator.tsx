import Block, {IUnit} from '../components/Block';
import Blocks from '../components/Blocks';
import Params, { ParamValue } from '../components/Params';
import Generator, {ICreate, IGenerator} from '../generators/Generator';
import { ISize } from '../types';

export default function listGenerator(name: string, exParams?: Params) {

  const _titleHeight = 34;
  const _itemHeight = 24;

  const values: Array<[string, ParamValue]> = [
    ['containersize', {width: 0, height: 0}],
    ['titleHeight', _titleHeight],
    ['itemHeight', _itemHeight]
  ];

  const _params = exParams ? exParams.restore(name, values) : new Params({name: 'listGenerator', initialValues: values});

  function init(g: IGenerator): Blocks {
    
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

  function create(args: ICreate): Block {
    const params = args.g.params();
    const containersize = params.get('containersize') as ISize;
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
        size: {width: containersize.width, height: args.index === 0? titleHeight : itemHeight}
      }
    }

    return args.g.layouts().set(name, p, args.g);
  }

  return new Generator(name, init, _params, create);
}