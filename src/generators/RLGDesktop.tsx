import {IPoint, ISize} from '../types';
import Params from '../components/Params';
import Generator, {IGenerator} from '../generators/Generator';
import Layout, {IUnit} from '../components/Layout';
import Layouts from '../components/Layouts';

export default function RLGDesktop(name: string) {

  const fullWidthHeaders = 0;
  const leftSideWidth = 200;
  const rightSideWidth = 0;
  const headerHeight = 24;
  const footerHeight = 24;

  const params = new Params([
    ['viewport', {width: 0, height: 0}],
    ['fullWidthHeaders', fullWidthHeaders],
    ['leftSideWidth', leftSideWidth],
    ['rightSideWidth', rightSideWidth],
    ['headerHeight', headerHeight],
    ['footerHeight', footerHeight]
  ])

  function init(g: IGenerator) {
    const viewport = params.get('viewport') as ISize;
    const fullWidthHeaders = params.get('fullWidthHeaders') as number;
    let leftSideWidth = params.get('leftSideWidth') as number;
    let rightSideWidth = params.get('rightSideWidth') as number;
    const headerHeight = params.get('headerHeight') as number;
    const footerHeight = params.get('footerHeight') as number;

    if (viewport.width < 800) {
      leftSideWidth = 0;
      rightSideWidth = 0;
    }

    const leftSide = function (): Layout {
      let location: IPoint;
      let size: ISize;
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: headerHeight
        }
        size = {
          width: leftSideWidth,
          height: viewport.height - footerHeight - headerHeight
        }
      } else {
        location = {
          x: 0,
          y: 0
        }
        size = {
          width: leftSideWidth,
          height: viewport.height
        }
      }
      
      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location: location,
        size: size
      }

      return new Layout('leftSize', p, g);
    }();

    const rightSide = function (): Layout {
      let location: IPoint;
      let size: ISize;

      if (fullWidthHeaders) {
        location = {
          x: viewport.width - rightSideWidth,
          y: headerHeight
        }
        size = {
          width: viewport.width,
          height: viewport.height - footerHeight - headerHeight
        }
      } else {
        location = {
          x: viewport.width - rightSideWidth,
          y: 0
        }
        size = {
          width: rightSideWidth,
          height: viewport.height
        }
      }

      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location: location,
        size: size
      }

      return new Layout('rightSide', p, g);
    }();

    const header = function (): Layout {
      let location: IPoint;
      let size: ISize;

      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: 0
        }
        size = {
          width: viewport.width,
          height: headerHeight
        }
      } else {
        location = {
          x: leftSideWidth,
          y: 0
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
        location: location,
        size: size
      }
      
      return new Layout('header', p, g);
    }();

    const content = function (): Layout {
       let location: IPoint;
      let size: ISize;
      if (fullWidthHeaders) {
        location = {
          x: leftSideWidth,
          y: headerHeight
        }
        size = {
          width: viewport.width - rightSideWidth,
          height: viewport.height - headerHeight - footerHeight
        }
      } else {
        location = {
          x: leftSideWidth,
          y: headerHeight
        }
        size = {
          width: viewport.width - rightSideWidth - leftSideWidth,
          height: viewport.height - footerHeight - headerHeight
        }
      }
      const p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location: location,
        size: size
      }
      
      return new Layout('content', p, g);
    }();

    const footer = function (): Layout {
      let location: IPoint;
      let size: ISize;
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: viewport.height - footerHeight
        }
        size ={
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
        location: location,
        size: size
      }
      
      return new Layout('footer', p, g);
    }();

    return new Layouts([
      [leftSide.name, leftSide],
      [rightSide.name, rightSide],
      [header.name, header],
      [content.name, content],
      [footer.name, footer]
    ])
  }

  return new Generator(name, init, params);
}
