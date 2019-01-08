import Block, { IUnit } from '../components/Block';
import Blocks from '../components/Blocks';
import Params, { ParamValue } from '../components/Params';
import Generator, { ICreate, IGenerator, IGeneratorFunctionArgs } from '../generators/Generator';
import { IAttrRect, ISize, rectSize } from '../types';

export default function rowsGenerator(gen: IGeneratorFunctionArgs) {

  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['align', 0], // -1: top, 0: center, 1: bottom
    ['spread', 0], // 0: keep height, 1: distributes over height
    ['itemSize', { width: 24, height: 24 }],
    ['itemMargin', { top: 2, bottom: 2, right: 0, left: 0 }]
  ]

  const _params = gen.exParams ? gen.exParams.restore(name, values) : new Params({
    name: 'rowsGenerator', initialValues: values
  });

  function init(g: IGenerator): Blocks {
    const params = g.params();
    const layouts = g.layouts();

    if (params.changed()) {
      distributeRows(layouts, params);
    }
    return layouts;
  }

  /**
   * Distribute rows
   */
  function distributeRows(layouts: Blocks, params: Params) {

    const containersize = params.get('containersize') as ISize;
    // const size = params.get('itemSize') as ISize;
    const margin = params.get('itemMargin') as IAttrRect;

    // update
    let currentHeight = margin.top;
    layouts.map.forEach((layout) => {
      const rect = layout.rect();
      const leftOffset = (containersize.width / 2 - (rect.width + margin.left + margin.right) / 2);
      layout.update({ x: leftOffset, y: currentHeight }, rectSize(rect));
      currentHeight += rect.height + margin.top + margin.bottom;
    });
  }

  function create(args: ICreate): Block {

    const params = args.g.params();
    const containersize = params.get('containersize') as ISize;
    const size = params.get('itemSize') as ISize;

    const layouts = args.g.layouts();

    let p = args.position;

    if (!p) {
      p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location: { x: 0, y: 0 },
        size
      }
    }

    const margin = params.get('itemMargin') as IAttrRect;
    let topOffset = margin.top;
    if (layouts.map.size) {
      const layout = layouts.find(layouts.map.size - 1);
      const r = layout.rect();
      topOffset = r.y + r.height + margin.bottom + margin.top;
    }
    const leftOffset = (containersize.width / 2) - (size.width + margin.left + margin.right) / 2;
    p.location = { x: leftOffset, y: topOffset }
    
    return layouts.set(args.name, p, args.g);
  }

  return new Generator(name, init, _params, create, gen.editHelper);
}