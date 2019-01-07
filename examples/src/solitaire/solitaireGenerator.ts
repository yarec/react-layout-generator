import Layout, { IPosition, IUnit } from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import Params, { ParamValue } from '../../../src/components/Params';
import Generator, { ICreate, IGenerator, IGeneratorFunctionArgs } from '../../../src/generators/Generator';
import { IPoint, ISize } from '../../../src/types';

export default function solitaireGenerator(gArgs: IGeneratorFunctionArgs) {

  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['gameMargin', 20],
    ['cardSizeRatio', 1.3],
    ['cardSpacingRatio', { x: .18, y: .17 }],
    ['cardMarginRatio', { x: .18, y: .1 }]
  ];

  const _params = gArgs.exParams ? gArgs.exParams.restore(name, values) : new Params({name, initialValues: values});

  function init(g: IGenerator): Layouts {

    const params = g.params();

    const containersize = params.get('containersize') as ISize;
    const gameMargin = params.get('gameMargin') as number;
    const cardSizeRatio = params.get('cardSizeRatio') as number;
    const cardSpacingRatio = params.get('cardSpacingRatio') as IPoint;

    const columns = containersize.width < 800 ? 7 : 8;
    const maxCards = 13;

    // 1) compute interval
    const interval = ((containersize.width - 2 * gameMargin) / columns)

    // 1) compute cardWidthSize
    const cardWidth = interval - gameMargin;
    const cardWidthSize = {
      width: cardWidth,
      height: cardWidth * cardSizeRatio
    }

    // 2) compute cardHeightSize
    const cardHeight = (containersize.height - 2 * gameMargin) / (2 + maxCards * cardSpacingRatio.y)
    const cardHeightSize = {
      width: cardHeight / cardSizeRatio,
      height: cardHeight
    }

    // 3) set cardSize to minimum of cardWidthSize and cardHeightSize
    const cardSize = cardWidthSize.width < cardHeightSize.width ? cardWidthSize : cardHeightSize;

    // Save cardSize for functions use
    params.set('cardSize', cardSize);
    params.set('computedCardSpacing', {x: cardSpacingRatio.x * cardSize.width, y: cardSpacingRatio.y * cardSize.height})

    const layouts = new Layouts([]);

    // Make layout responsive
    // Adjust number of columns if smaller containersize
    const foundationStart = containersize.width < 800 ? 1 : 0;
    const tableauStart = containersize.width < 800 ? 1 : 0

    // Stock
    const stock: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
      location: { x: gameMargin + (interval - cardSize.width) / 2, y: gameMargin },
      size: cardSize,
      positionChildren: positionStockChildren
    }
    // console.log('cardSize', cardSize);

    layouts.set('stock', stock, g);

    // Waste
    const waste: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
      location: { x: stock.location.x + interval, y: gameMargin },
      size: { width: cardSize.width + 3 * cardSize.width * cardSpacingRatio.x, height: cardSize.height },
      positionChildren: positionWasteChildren
    }

    layouts.set('waste', waste, g);

    // Foundation
    for (let i = 4 - foundationStart; i < 8 - foundationStart; i++) {
      const offset = i * interval;
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
        location: { x: stock.location.x + offset, y: gameMargin },
        size: cardSize,
        positionChildren: positionFoundationChildren
      }

      layouts.set(`foundation${i - 3 + foundationStart}`, p, g);
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

      layouts.set(`tableau${i + tableauStart}`, p, g);
    }

    // Return new instance of Layouts
    return layouts;
  }

  function create(cArgs: ICreate): Layout {

    if (!cArgs.position) {
      console.error(`TODO default position ${cArgs.name}`);
    }

    const layout = cArgs.g.layouts().set(cArgs.name, cArgs.position, cArgs.g);

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

    // This layout is temporary and will not be stored in layouts
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

  return new Generator(name, init, _params, create, gArgs.editHelper);
}


