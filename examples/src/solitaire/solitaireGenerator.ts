import Layout, { IPosition, IUnit } from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import Params, { ParamValue } from '../../../src/components/Params';
import Generator, { ICreate, IGenerator } from '../../../src/generators/Generator';
import { IPoint, ISize } from '../../../src/types';
// import { clone } from '../../../src/utils';

export default function solitaireGenerator(name: string, exParams?: Params, parent?: IGenerator) {

  const values: Array<[string, ParamValue]> = [
    ['viewport', { width: 0, height: 0 }],
    ['gameMargin', 20],
    ['cardSizeRatio', 1.3],
    ['cardSpacingRatio', { x: .18, y: .17 }],
    ['cardMarginRatio', { x: .18, y: .1 }]
  ];

  const _params = exParams ? exParams.restore(name, values) : new Params(values);

  function init(g: IGenerator): Layouts {

    const params = g.params();

    const viewport = params.get('viewport') as ISize;
    const gameMargin = params.get('gameMargin') as number;
    const cardSizeRatio = params.get('cardSizeRatio') as number;
    const cardSpacingRatio = params.get('cardSpacingRatio') as IPoint;

    const columns = viewport.width < 800 ? 7 : 8;
    const maxCards = 13;

    // 1) compute interval
    const interval = ((viewport.width - 2 * gameMargin) / columns)

    // 1) compute cardWidthSize
    const cardWidth = interval - gameMargin;
    const cardWidthSize = {
      width: cardWidth,
      height: cardWidth * cardSizeRatio
    }

    // 2) compute cardHeightSize
    const cardHeight = (viewport.height - 2 * gameMargin) / (2 + maxCards * cardSpacingRatio.y)
    const cardHeightSize = {
      width: cardHeight / cardSizeRatio,
      height: cardHeight
    }

    // 3) set cardSize to minimum of cardWidthSize and cardHeightSize
    const cardSize = cardWidthSize.width < cardHeightSize.width ? cardWidthSize : cardHeightSize;

    console.log('cardSize', cardSize.width, cardSize.height);
    console.log('cardHeightSize', cardHeightSize.width, cardHeightSize.height);
    console.log('cardWidthSize', cardWidthSize.width, cardWidthSize.height);

    // Save cardSize for functions use
    params.set('cardSize', cardSize);
    params.set('computedCardSpacing', {x: cardSpacingRatio.x * cardSize.width, y: cardSpacingRatio.y * cardSize.height})

    const layouts = new Layouts([]);

    // Make layout responsive
    // Adjust number of columns if smaller viewport
    const foundationStart = viewport.width < 800 ? 1 : 0;
    const tableauStart = viewport.width < 800 ? 1 : 0

    // Stock
    const stock: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
      location: { x: gameMargin + (interval - cardSize.width) / 2, y: gameMargin },
      size: cardSize,
      positionChildren: positionStockChildren
    }
    // console.log('cardSize', cardSize);

    layouts.set('stock', new Layout('stock', stock, g));

    // Waste
    const waste: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
      location: { x: stock.location.x + interval, y: gameMargin },
      size: { width: cardSize.width + 3 * cardSize.width * cardSpacingRatio.x, height: cardSize.height },
      positionChildren: positionWasteChildren
    }

    layouts.set('waste', new Layout('waste', waste, g));

    // Foundation
    for (let i = 4 - foundationStart; i < 8 - foundationStart; i++) {
      const offset = i * interval;
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
        location: { x: stock.location.x + offset, y: gameMargin },
        size: cardSize,
        positionChildren: positionFoundationChildren
      }

      const layout = new Layout(`foundation${i - 3 + foundationStart}`, p, g);

      // console.log(`create layout ${layout.name} ${p.location.x} ${p.location.y}`);

      layouts.set(layout.name, layout);
    }

    // Tableau
    for (let i = 1 - tableauStart; i < 8 - tableauStart; i++) {
      const offset = i * interval;
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
        location: { x: stock.location.x + offset, y: cardSize.height + 2 * gameMargin },
        size: { width: cardSize.width, height: cardSize.height + maxCards * cardSpacingRatio.y * cardSize.height },
        positionChildren: positionTableauChildren
      }

      const layout = new Layout(`tableau${i + tableauStart}`, p, g);
      layouts.set(layout.name, layout);
    }

    // Return new instance of Layouts
    return layouts;
  }

  function create(args: ICreate): Layout {

    if (!args.position) {
      console.error(`TODO default position ${args.name}`);
    }

    const layout = new Layout(args.name, args.position, args.g);

    args.g.layouts().set(layout.name, layout);

    return layout;
  }

  function positionStockChildren(layout: Layout, g: Generator, index: number) {
    // Return a Layout relative to layout starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;

    // These children get placed on top of each other

    const child: IPosition = {
      units: layout.units,
      location: { x: 0, y: 0 },
      size: cardSize
    };

    // This layout is temp and will not be stored in layouts
    return new Layout('temp', child, g);
  }

  function positionFoundationChildren(layout: Layout, g: IGenerator, index: number) {
    // Return a Layout relative to layout starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;

    // These children get placed on top of each other

    const child: IPosition = {
      units: layout.units,
      location: { x: 0, y: 0 },
      size: cardSize
    };

    // This layout is temp and will not be stored in layouts
    return new Layout('temp', child, g);
  }

  function positionTableauChildren(layout: Layout, g: IGenerator, index: number) {
    // Return a Layout relative to layout starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;
    const computedCardSpacing = g.params().get('computedCardSpacing') as IPoint;

    // These children get placed vertically based on index
    const child: IPosition = {
      units: layout.units,
      location: { x: 0, y: index * computedCardSpacing.y },
      size: cardSize
    };

    // This layout is temp and will not be stored in layouts
    return new Layout('temp', child, g);
  }

  function positionWasteChildren(layout: Layout, g: Generator, index: number) {
    // Return a Layout relative to layout starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;
    const computedCardSpacing = g.params().get('computedCardSpacing') as IPoint;

    // These children get placed horizontally based on index
    const child: IPosition = {
      units: layout.units,
      location: { x: index * computedCardSpacing.x, y: 0 },
      size: cardSize
    };

    // This layout is temp and will not be stored in layouts
    return new Layout('temp', child, g);
  }

  return new Generator(name, init, _params, create, parent);
}


