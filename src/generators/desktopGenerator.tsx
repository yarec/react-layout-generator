import { Block, IPosition } from '../components/Block';
import { Params, ParamValue } from '../components/Params';
import { updateParamHeight, updateParamWidth } from '../editors/update';
import { Generator, ICreate, IGenerator } from '../generators/Generator';
import { IPoint, ISize, Unit, PositionRef } from '../types';

export function desktopGenerator(name: string, exParams?: Params) {

  const _fullWidthHeaders = 0;
  const _titleHeight = 50;
  const _leftSideWidth = 200;
  const _rightSideWidth = 0;
  const _headerHeight = 24;
  const _footerHeight = 24;

  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['fullWidthHeaders', _fullWidthHeaders],
    ['titleHeight', _titleHeight],
    ['leftSideWidth', _leftSideWidth],
    ['rightSideWidth', _rightSideWidth],
    ['headerHeight', _headerHeight],
    ['footerHeight', _footerHeight]
  ];

  const _params = exParams ? exParams.restore(name, values) : new Params({
    name: 'desktopGenerator', initialValues: values
  });

  function init(g: IGenerator) {
    const params = g.params();
    const blocks = g.blocks();
    const containersize = params.get('containersize') as ISize;
    const fullWidthHeaders = params.get('fullWidthHeaders') as number;
    const titleHeight = params.get('titleHeight') as number;
    let leftSideWidth = params.get('leftSideWidth') as number;
    let rightSideWidth = params.get('rightSideWidth') as number;
    const headerHeight = params.get('headerHeight') as number;
    const footerHeight = params.get('footerHeight') as number;

    if (containersize.width < 600) {
      leftSideWidth = 0;
      rightSideWidth = 0;
    }

    let location: IPoint;
    let size: ISize;
    let p: IPosition;

    // Define parts
    title();
    leftSide();
    rightSde();
    header();
    content();
    footer();

    return blocks;

    function footer() {
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: containersize.height - footerHeight
        };
        size = {
          width: containersize.width,
          height: footerHeight
        };
      }
      else {
        location = {
          x: leftSideWidth,
          y: containersize.height - footerHeight
        };
        size = {
          width: containersize.width - leftSideWidth - rightSideWidth,
          height: footerHeight
        };
      }
      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        editor: {
          edits: [
            { ref: PositionRef.top, variable: 'footerHeight', updateParam: updateParamHeight }
          ]
        },
        location,
        size
      };
      blocks.set('footer', p, g);
    }

    function content() {
      location = {
        x: leftSideWidth,
        y: titleHeight + headerHeight
      };
      size = {
        width: containersize.width - rightSideWidth - leftSideWidth,
        height: containersize.height - titleHeight - headerHeight  - footerHeight
      };

      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        location,
        size
      };
      blocks.set('content', p, g);
    }

    function header() {
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: titleHeight
        };
        size = {
          width: containersize.width,
          height: headerHeight
        };
      }
      else {
        location = {
          x: leftSideWidth,
          y: titleHeight
        };
        size = {
          width: containersize.width - leftSideWidth - rightSideWidth,
          height: headerHeight
        };
      }
      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        editor: {
          edits: [
            { ref: PositionRef.bottom, variable: 'headerHeight', updateParam: updateParamHeight }
          ]
        },
        location,
        size
      };
      blocks.set('header', p, g);
    }

    // function contentHeader() {
    //   location = {
    //     x: leftSideWidth,
    //     y: titleHeight + headerHeight
    //   };
    //   size = {
    //     width: containersize.width - leftSideWidth - rightSideWidth,
    //     height: contentHeaderHeight
    //   };

    //   p = {
    //     units: {
    //       location: Unit.pixel,
    //       size: Unit.pixel
    //     },
    //     editor: {
    //       edits: [
    //         { ref: PositionRef.bottom, variable: 'contentHeaderHeight', updateParam: updateParamHeight }
    //       ]
    //     },
    //     location,
    //     size
    //   };
    //   blocks.set('contentHeader', p, g);
    // }

    function rightSde() {
      if (fullWidthHeaders) {
        location = {
          x: containersize.width - rightSideWidth,
          y: titleHeight + headerHeight
        };
        size = {
          width: rightSideWidth,
          height: containersize.height - titleHeight - footerHeight - headerHeight
        };
      }
      else {
        location = {
          x: containersize.width - rightSideWidth,
          y: 0
        };
        size = {
          width: rightSideWidth,
          height: containersize.height - titleHeight
        };
      }
      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        editor: {
          edits: [
            { ref: PositionRef.left, variable: 'rightSideWidth', updateParam: updateParamWidth }
          ]
        },
        location,
        size
      };
      blocks.set('rightSide', p, g);
    }

    function leftSide() {
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: titleHeight + headerHeight
        };
        size = {
          width: leftSideWidth,
          height: containersize.height - titleHeight - footerHeight - headerHeight
        };
      }
      else {
        location = {
          x: 0,
          y: 0
        };
        size = {
          width: leftSideWidth,
          height: containersize.height - titleHeight
        };
      }
      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        editor: {
          edits: [
            {
              ref: PositionRef.right,
              variable: 'leftSideWidth',
              updateParam: updateParamWidth
            }
          ]
        },
        location,
        size
      };
      blocks.set('leftSide', p, g);
    }

    function title() {
      location = {
        x: 0,
        y: 0
      };
      size = {
        width: containersize.width,
        height: titleHeight
      };
      p = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        editor: {
          edits: [
            {
              ref: PositionRef.bottom, variable: 'titleHeight', updateParam: updateParamHeight,
            }
          ]
        },
        location,
        size
      };
      blocks.set('title', p, g);
    }
  }

  function create(args: ICreate): Block {

    if (!args.position) {
      console.error(`TODO default position ${args.name}`)
    }

    return args.g.blocks().set(args.name, args.position, args.g);
  }

  return new Generator(name, init, _params, create);
}
