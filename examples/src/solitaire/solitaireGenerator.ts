import Layout, { IPosition, IUnit } from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import Params from '../../../src/components/Params';
import Generator, { ICreate, IGenerator } from '../../../src/generators/Generator';
import { IPoint, ISize } from '../../../src/types'

export default function solitaireGenerator(name: string, parent?: IGenerator) {

  const _cardSize = { width: 10, height: 16 }
  const _cardSpacing = { x: .02, y: .027 };
  const _foundationStackSpacing = 2;
  const _tableauStackSpacing = 2;  

  const _stockLocation = { x: 2, y: 10 };
  const _wasteLocation = { x: 14, y: 10 };
  const _foundationLocation = { x: 48, y: 10 };
  const _tableauLocation = { x: 14, y: 40 };

  const _params = new Params([
    ['viewport', { width: 0, height: 0 }],
    ['cardSize', _cardSize],
    ['cardSpacing', _cardSpacing],
    ['foundationStackSpacing', _foundationStackSpacing],
    ['tableauStackSpacing', _tableauStackSpacing],
    ['stockLocation', _stockLocation],
    ['wasteLocation', _wasteLocation],
    ['foundationLocation', _foundationLocation],
    ['tableauLocation', _tableauLocation],
  ])

  function init(g: IGenerator): Layouts {

    const params = g.params();

    const cardSize = params.get('cardSize') as ISize;
    const stockLocation = params.get('stockLocation') as IPoint;
    const foundationLocation = params.get('foundationLocation') as IPoint;
    const tableauLocation = params.get('tableauLocation') as IPoint;
    const wasteLocation = params.get('wasteLocation') as IPoint;
    const foundationStackSpacing = params.get('foundationStackSpacing') as number;
    const tableauStackSpacing = params.get('tableauStackSpacing') as number;

    const layouts = new Layouts([]);

    // Stock
    const stock: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.preserve },
      location: stockLocation,
      size: cardSize,
      positionChildren: positionStockChildren
    }
    // console.log('cardSize', cardSize);

    layouts.set('stock', new Layout('stock', stock, g));

    // Foundation
    for (let i = 0; i < 4; i++) {
      const offset = i * (foundationStackSpacing + cardSize.width);
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.preserve },
        location: { x: foundationLocation.x + offset, y: foundationLocation.y },
        size: cardSize,
        positionChildren: positionFoundationChildren
      }

      const layout = new Layout(`foundation${i + 1}`, p, g);

      layouts.set(layout.name, layout);
    }

    // Tableau
    for (let i = 0; i < 7; i++) {
      const offset = i * (tableauStackSpacing + cardSize.width);
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.preserve },
        location: { x: tableauLocation.x + offset, y: tableauLocation.y },
        size: cardSize,
        positionChildren: positionTableauChildren
      }

      layouts.set(`tableau${i + 1}`, new Layout(`tableau${i + 1}`, p, g));
    }

    // Waste
    const waste: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.preserve },
      location: { x: wasteLocation.x, y: wasteLocation.y },
      size: cardSize,
      positionChildren: positionWasteChildren
    }

    layouts.set('waste', new Layout('waste', waste, g));

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

  function positionStockChildren(layout: Layout, params: Params, index: number) {
    return layout.rect();
  }
  
  function positionFoundationChildren(layout: Layout, params: Params, index: number) {
    return layout.rect();
  }
  
  function positionTableauChildren(layout: Layout, params: Params, index: number) {
    // const viewport = params.get('viewport');
    const cardSpacing = layout.scale(params.get('cardSpacing') as IPoint, layout.units.location);
    const start = layout.rect();
    // console.log(`positionTableauChildren viewport: ${(viewport as ISize).width}, ${start.x}, ${start.width}, ${(cardSpacing as IPoint).x}`);
    return { x: start.x, y: start.y + ((cardSpacing as IPoint).y * index),
      width: start.width, height: start.height };
  }
  
  function positionWasteChildren(layout: Layout, params: Params, index: number) {
    const cardSpacing = layout.scale(params.get('cardSpacing') as IPoint, layout.units.location);
    const start = layout.rect();
    return { x: start.x + ((cardSpacing as IPoint).x * index), y: start.y,
      width: start.width, height: start.height };
  }

  return new Generator(name, init, _params, create, parent);
}

