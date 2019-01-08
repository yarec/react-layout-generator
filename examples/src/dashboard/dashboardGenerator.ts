import Block, { IEdit, IPosition, IUnit, PositionRef } from '../../../src/components/Block';
import Generator, { IGenerator } from '../../../src/generators/Generator';
import { IPoint, IRect, ISize } from '../../../src/types';

import Blocks from '../../../src/components/Blocks';
import Params from '../../../src/components/Params';




export default function RLGDesktop(name: string, parent?: IGenerator) {

  const _titleHeight = 50;
  const _leftSideWidth = 200;
  const _rightSideWidth = 0;
  const _headerHeight = 24;
  const _footerHeight = 24;

  const _params = new Params([
    ['viewport', { width: 0, height: 0 }],
    ['titleHeight', _titleHeight],
    ['leftSideWidth', _leftSideWidth],
    ['rightSideWidth', _rightSideWidth],
    ['headerHeight', _headerHeight],
    ['footerHeight', _footerHeight]
  ])

  function init(g: IGenerator) {
    const params = g.params();
    const viewport = params.get('viewport') as ISize;
    const fullWidthHeaders = params.get('fullWidthHeaders') as number;
    const titleHeight = params.get('titleHeight') as number;
    let leftSideWidth = params.get('leftSideWidth') as number;
    let rightSideWidth = params.get('rightSideWidth') as number;
    const headerHeight = params.get('headerHeight') as number;
    const footerHeight = params.get('footerHeight') as number;

    if (viewport.width < 600) {
      leftSideWidth = 0;
      rightSideWidth = 0;
    }

    const title = (): Block => {
      let location: IPoint;
      let size: ISize;
      location = {
        x: 0,
        y: 0
      }
      size = {
        width: viewport.width,
        height: titleHeight
      }

      const p: IPosition = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        edit: [
          { ref: PositionRef.bottom, variable: 'titleHeight', updateParam: updateParamHeight }
        ],
        location,
        size
      }

      return new Block('title', p, g);
    };

    const leftSide = (): Block => {
      let location: IPoint;
      let size: ISize;
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: titleHeight + headerHeight
        }
        size = {
          width: leftSideWidth,
          height: viewport.height - titleHeight - footerHeight - headerHeight
        }
      } else {
        location = {
          x: 0,
          y: 0
        }
        size = {
          width: leftSideWidth,
          height: viewport.height - titleHeight
        }
      }

      const p: IPosition = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        edit: [
          { ref: PositionRef.right, variable: 'leftSideWidth', updateParam: updateParamWidth }
        ],
        location,
        size
      }

      return new Block('leftSide', p, g);
    };

    const rightSide = (): Block => {
      let location: IPoint;
      let size: ISize;

      if (fullWidthHeaders) {
        location = {
          x: viewport.width - rightSideWidth,
          y: titleHeight + headerHeight
        }
        size = {
          width: rightSideWidth,
          height: viewport.height - titleHeight - footerHeight - headerHeight
        }
      } else {
        location = {
          x: viewport.width - rightSideWidth,
          y: 0
        }
        size = {
          width: rightSideWidth,
          height: viewport.height - titleHeight
        }
      }

      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        edit: [
          { ref: PositionRef.left, variable: 'rightSideWidth', updateParam: updateParamWidth }
        ],
        location,
        size
      }

      return new Block('rightSide', p, g);
    };

    const header = (): Block => {
      let location: IPoint;
      let size: ISize;

      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: titleHeight
        }
        size = {
          width: viewport.width,
          height: headerHeight
        }
      } else {
        location = {
          x: leftSideWidth,
          y: titleHeight
        }
        size = {
          width: viewport.width - leftSideWidth - rightSideWidth,
          height: headerHeight
        }
      }

      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        edit: [
          { ref: PositionRef.bottom, variable: 'headerHeight', updateParam: updateParamHeight }
        ],
        location,
        size
      }

      return new Block('header', p, g);
    };

    const content = (): Block => {
      let location: IPoint;
      let size: ISize;
      if (fullWidthHeaders) {
        location = {
          x: leftSideWidth,
          y: titleHeight + headerHeight
        }
        size = {
          width: viewport.width - rightSideWidth - leftSideWidth,
          height: viewport.height - titleHeight - headerHeight - footerHeight
        }
      } else {
        location = {
          x: leftSideWidth,
          y: headerHeight
        }
        size = {
          width: viewport.width - rightSideWidth - leftSideWidth,
          height: viewport.height - titleHeight - footerHeight - headerHeight
        }
      }
      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location,
        size
      }

      return new Block('content', p, g);
    };

    const footer = (): Block => {
      let location: IPoint;
      let size: ISize;
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: viewport.height - footerHeight
        }
        size = {
          width: viewport.width,
          height: footerHeight
        }
      } else {
        location = {
          x: leftSideWidth,
          y: viewport.height - footerHeight
        }
        size = {
          width: viewport.width - leftSideWidth - rightSideWidth,
          height: footerHeight
        }
      }

      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        edit: [
          { ref: PositionRef.top, variable: 'footerHeight', updateParam: updateParamHeight }
        ],
        location,
        size
      }

      return new Block('footer', p, g);
    };

    // Return new instance of Layouts
    return new Blocks([
      [title.name, title()],
      [leftSide.name, leftSide()],
      [rightSide.name, rightSide()],
      [header.name, header()],
      [content.name, content()],
      [footer.name, footer()]
    ])
  }

  return new Generator(name, init, _params, undefined, parent);
}
