import { Block } from '../components/Block';
import { Blocks } from '../components/Blocks';
import { Params, ParamValue } from '../components/Params';
import { Generator, ICreate, IGenerator } from '../generators/Generator';
import { ISize, Unit } from '../types';

export function columnsGenerator(name: string, exParams?: Params) {

  const defaultItemWidth = 100;

  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['itemSize', { width: defaultItemWidth, height: 0 }]
  ]

  const _params = exParams ? exParams.restore(name, values) : new Params({
    name: 'columnsGenerator', initialValues: values
  });

  function init(g: IGenerator): Blocks {
    // const params = g.params();
    // const blocks = g.blocks();

    // const align = params.get('align') as number;

    // if (params.changed()) {

    // update Layout for each update
    // if (align === 0) {
    //   centerColumns(blocks, params);

    // blocks.map.forEach((block) => {
    //   console.log(`centerColumns ${block.name} ${block.rect().x}`)
    // });
    return new Blocks([]);
  }
  // }


  /**
   * Align items in center
   */
  function centerColumns(blocks: Blocks, params: Params) {

    const containersize = params.get('containersize') as ISize;
    // const margin = params.get('itemMargin') as IAttrRect;

    // compute width of all columns
    let totalWidth = 0
    blocks.map.forEach((block) => {
      totalWidth += block.rect().width;
    });

    // compute beginning offset
    const offset0 = (containersize.width / 2 - totalWidth / 2);

    // update
    let currentWidth = 0;
    blocks.map.forEach((block) => {
      const rect = block.rect();
      block.update({ x: offset0 + currentWidth, y: 0 }, { width: rect.width, height: containersize.height });
      currentWidth += rect.width;
    });
  }

  function create(args: ICreate): Block {
    // console.log(`centerColumns: create ${args.name}`)
    const params = args.g.params();
    const containersize = params.get('containersize') as ISize;
    const itemSize = params.get('itemSize') as ISize;

    const blocks = args.g.blocks();

    let p = args.position;

    // console.log('create width', p.size.width);

    if (!p) {
      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        location: { x: 0, y: 0 },
        size: { width: itemSize.width, height: containersize.height }
      }
    }

    const l = blocks.set(args.name, p, args.g);

    const align = params.get('align') as number;


    // if ((args.index + 1) === args.count) {

    if (align === 0) {
      centerColumns(blocks, params);
    }
    // }

    return l;
  }

  return new Generator(name, init, _params, create);
}