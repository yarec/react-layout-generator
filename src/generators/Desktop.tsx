import {IRect} from '../types';
import Params from '../components/Params';
import Layout from '../components/Layout';
import Layouts from '../components/Layouts';

export function DesktopLayout(name: string) {

  const fullWidthHeaders = 0;
  const leftSideWidth = 200;
  const rightSideWidth = 0;
  const headerHeight = 24;
  const footerHeight = 24;

  const params = new Params([
    ['width', 0],
    ['height', 0],
    ['fullWidthHeaders', fullWidthHeaders],
    ['leftSideWidth', leftSideWidth],
    ['rightSideWidth', rightSideWidth],
    ['headerHeight', headerHeight],
    ['footerHeight', footerHeight]
  ])

  function init(params: Params, layouts?: Layouts): Layouts {
    const width = params.get('width') as number;
    const height = params.get('height') as number;
    const fullWidthHeaders = params.get('fullWidthHeaders') as number;
    let leftSideWidth = params.get('leftSideWidth') as number;
    let rightSideWidth = params.get('rightSideWidth') as number;
    const headerHeight = params.get('headerHeight') as number;
    const footerHeight = params.get('footerHeight') as number;

    if (width < 800) {
      leftSideWidth = 0;
      rightSideWidth = 0;
    }

    // console.log('rightSideWidth', rightSideWidth)

    const leftSide = function (): Layout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          x: 0,
          y: headerHeight,
          width: leftSideWidth,
          height: height - footerHeight - headerHeight
        }
      } else {
        location = {
          x: 0,
          y: 0,
          width: leftSideWidth,
          height: height
        }
      }
      //  console.log('leftSide', location);
      return {
        name: 'leftSide',
        edit: [{ positionRef: PositionRef.scalar_width_right, variable: 'leftSideWidth', update: scalarWidthUpdate }],
        location: new Rect(location)
      }
    }();

    const rightSide = function (): ILayout {
      let location: IRect;

      if (fullWidthHeaders) {
        location = {
          left: width - rightSideWidth,
          top: headerHeight,
          right: width,
          bottom: height - footerHeight
        }
      } else {
        location = {
          left: width - rightSideWidth,
          top: 0,
          right: width,
          bottom: height
        }
      }
      // console.log('rightSide', location);
      return {
        name: 'rightSide',
        editSize: [{ positionRef: PositionRef.scalar_width_left, variable: 'rightSideWidth', update: scalarWidthUpdate }],
        location: new Rect(location)
      }
    }();

    const header = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: 0,
          right: width,
          bottom: headerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: 0,
          right: width,
          bottom: headerHeight
        }
      }
      // console.log('header', location);
      return {
        name: 'header',
        location: new Rect(location)
      }
    }();

    const content = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: leftSideWidth,
          top: headerHeight,
          right: width - rightSideWidth,
          bottom: height - footerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: headerHeight,
          right: width - rightSideWidth,
          bottom: height - footerHeight
        }
      }
      // console.log('content', location);
      return {
        name: 'content',
        location: new Rect(location)
      }
    }();

    const footer = function (): ILayout {
      let location: IRect;
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: height - footerHeight,
          right: width,
          bottom: height
        }
      } else {
        location = {
          left: leftSideWidth,
          top: height - footerHeight,
          right: width,
          bottom: height
        }
      }
      //console.log('footer', location);
      return {
        name: 'footer',
        location: new Rect(location)
      }
    }();

    return new Layouts([
      [leftSide.name, leftSide],
      [rightSide.name, rightSide],
      [header.name, header],
      [content.name, content],
      [footer.name, footer]
    ])
  }

  return new BasicLayoutGenerator(name, init, params);
}
