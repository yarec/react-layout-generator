import BasicLayoutGenerator, { Params, ILayout } from '../LayoutGenerator';
import { IRect, IPosition } from '../types';
import {positionToRect} from '../utils';

export default function ListLayout(name: string) {

  const titleHeight = 34;
  const itemHeight = 24;

  const params = new Params([
    ['width', 0],
    ['height', 0],
    ['titleHeight', titleHeight],
    ['itemHeight', itemHeight]
  ])

  function init(params: Params, layouts?: Map<string, ILayout>): Map<string, ILayout> {
    const width = params.get('width') as number;

    const title = function (): ILayout {
      let location: IRect = {
        left: 0,
        top: 0,
        right: width,
        bottom: titleHeight
      }

      return {
        name: 'title',
        location: location
      }
    }();

    params.set('LastItemVerticalOffset', titleHeight);

    return new Map([
      [title.name, title]
    ])
  }

  function create(name: string, params: Params, layouts: Map<string, ILayout>, position: IPosition): ILayout {
    const width = params.get('width') as number;
    const height = params.get('height') as number;
    const itemHeight = params.get('itemHeight') as number;

    const LastItemVerticalOffset = params.get('LastItemVerticalOffset') as number;

    if (!position) {
      position = {
        location: {
          x: 0,
          y: LastItemVerticalOffset
        },
        size: {
          x: width,
          y: itemHeight
        }
      }
    }

    console.log('create', position)

    // Update offset for next item
    params.set('LastItemVerticalOffset', position.location.y + position.size.y);

    const box: ILayout = {
      name: name,
      location: positionToRect(position, width, height)
    }

    // Insert layout
    layouts.set(box.name, box);
    // Update params
    params.set(name, position);

    // return layout
    return box;
  }

  return new BasicLayoutGenerator(name, init, params, create);
}