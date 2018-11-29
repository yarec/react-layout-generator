import Layout, { IPosition, IUnit } from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import Params from '../../../src/components/Params';
import Generator, { ICreate, IGenerator } from '../../../src/generators/Generator';
import { IPoint, ISize } from '../../../src/types'

export default function solitaireGenerator(name: string, parent?: IGenerator) {

  const _params = new Params([
    ['viewport', { width: 0, height: 0 }]
  ])

  function init(g: IGenerator): Layouts {

    const params = g.params();

    const layouts = new Layouts([]);

    

    // Return new instance of Layouts
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
  
  function positionChildren(layout: Layout, params: Params, index: number) {
    // Relative to layout - position at (cardSpacing.x * index, 0)
    const cardSpacing = layout.scale(params.get('cardSpacing') as IPoint, layout.units.location) as IPoint;
    const cardSize = params.get('cardSize') as ISize;
    const scaledCardSize = layout.scale({width: cardSize.width / 100, height: cardSize.height / 100 }, layout.units.size) as ISize;

    return { x: cardSpacing.x * index, y: 0,
      width: scaledCardSize.width, height: scaledCardSize.height };
  }

  return new Generator(name, init, _params, create, parent);
}

