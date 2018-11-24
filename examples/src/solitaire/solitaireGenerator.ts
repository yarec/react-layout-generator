import Layout, { IPosition, IUnit } from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import Params from '../../../src/components/Params';
import Generator, { ICreate, IGenerator } from '../../../src/generators/Generator';
import { IPoint, ISize } from '../../../src/types'

export default function solitaireGenerator(name: string, parent?: IGenerator) {

  const _cardSize = { width: 9, height: 12 }
  const _cardSpacing = { x: 2.5, y: 2.5 };
  const _foundationStackSpacing = 2;
  const _tableauStackSpacing = 2;

  const _stockLocation = { x: 5, y: 5 };
  const _wasteLocation = { x: 18, y: 5 };
  const _foundationLocation = { x: 53, y: 5 };
  const _tableauLocation = { x: 25, y: 30 };

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

    const stock: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
      location: stockLocation,
      size: cardSize
    }

    layouts.set('stock', new Layout('stock', stock, g));

    for (let i = 0; i < 4; i++) {
      const offset = i * (foundationStackSpacing + cardSize.width);
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
        location: { x: foundationLocation.x + offset, y: foundationLocation.y },
        size: cardSize
      }

      layouts.set(`foundation${i + 1}`, new Layout(`foundation${i + 1}`, p, g));
    }

    for (let i = 0; i < 7; i++) {
      const offset = i * (tableauStackSpacing + cardSize.width);
      const p: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
        location: { x: tableauLocation.x + offset, y: tableauLocation.y },
        size: cardSize
      }

      layouts.set(`tableau${i + 1}`, new Layout(`tableau${i + 1}`, p, g));
    }

    const waste: IPosition = {
      units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
      location: { x: wasteLocation.x, y: wasteLocation.y },
      size: cardSize
    }

    layouts.set('waste', new Layout('waste', waste, g));

    // Return new instance of Layouts
    return layouts;
  }

  return new Generator(name, init, _params, undefined, parent);
}