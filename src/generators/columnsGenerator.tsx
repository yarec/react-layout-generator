import Layout, { IUnit } from '../components/Layout';
import Layouts from '../components/Layouts';
import Params, { ParamValue } from '../components/Params';
import Generator, { ICreate, IGenerator } from '../generators/Generator';
import { ISize } from '../types';

export default function columnsGenerator(name: string, exParams?: Params) {

  const defaultItemWidth = 100;

  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['itemSize', {width: defaultItemWidth, height: 0}]
  ]

  const _params = exParams ? exParams.restore(name, values) : new Params({
    name: 'columnsGenerator', initialValues: values});

  function init(g: IGenerator): Layouts {
    // const params = g.params();
    // const layouts = g.layouts();

    // const align = params.get('align') as number;

    // if (params.changed()) {

    // update Layout for each update
    // if (align === 0) {
    //   centerColumns(layouts, params);

    // layouts.map.forEach((layout) => {
    //   console.log(`centerColumns ${layout.name} ${layout.rect().x}`)
    // });
    return new Layouts([]);
  }
  // }


  /**
   * Align items in center
   */
  function centerColumns(layouts: Layouts, params: Params) {

    const containersize = params.get('containersize') as ISize;
    // const margin = params.get('itemMargin') as IAttrRect;

    // compute width of all columns
    let totalWidth = 0
    layouts.map.forEach((layout) => {
      totalWidth += layout.rect().width;
    });

    // compute beginning offset
    const offset0 = (containersize.width / 2 - totalWidth / 2);

    // update
    let currentWidth = 0;
    layouts.map.forEach((layout) => {
      const rect = layout.rect();
      layout.update({ x: offset0 + currentWidth, y: 0 }, { width: rect.width, height: containersize.height });
      currentWidth += rect.width;
    });
  }

  function create(args: ICreate): Layout {
    // console.log(`centerColumns: create ${args.name}`)
    const params = args.g.params();
    const containersize = params.get('containersize') as ISize;
    const itemSize = params.get('itemSize') as ISize;

    const layouts = args.g.layouts();

    let p = args.position;

    // console.log('create width', p.size.width);

    if (!p) {
      p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location: { x: 0, y: 0 },
        size: { width: itemSize.width, height: containersize.height }
      }
    }

    const l = layouts.set(args.name, p, args.g);

    const align = params.get('align') as number;


    // if ((args.index + 1) === args.count) {

    if (align === 0) {
      centerColumns(layouts, params);
    }
    // }

    return l;
  }

  return new Generator(name, init, _params, create);
}