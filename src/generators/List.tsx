import BasicLayoutGenerator, { Params, ILayout, Layouts } from '../LayoutGenerator';
import { IRect, IPosition, IUnit, IOrigin } from '../types';
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

  function init(params: Params, layouts?: Layouts): Layouts {
    const width = params.get('width') as number;
    const height = params.get('height') as number;
    let updates: Array<ILayout> = params.updates();

    if (!layouts) {
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
      console.log('init LastItemVerticalOffset',titleHeight)
      return new Layouts([
        [title.name, title]
      ])
    }
    else if (updates && layouts) {
      updates.forEach((layout) => {
        let p = params.get(layout.name) as IPosition;
        if (p) {
          // console.log('init ' + layout.name + ' params', p)
          layout.location = positionToRect(p, width, height);
          layouts.set(layout.name, layout);
        }
      });
    }
    return layouts;

    // if (!updates) {
    //   const title = function (): ILayout {
    //     let location: IRect = {
    //       left: 0,
    //       top: 0,
    //       right: width,
    //       bottom: titleHeight
    //     }
  
    //     return {
    //       name: 'title',
    //       location: location
    //     }
    //   }();
  
    //   params.set('LastItemVerticalOffset', titleHeight);
    //   console.log('init LastItemVerticalOffset',titleHeight)
    //   return new Map([
    //     [title.name, title]
    //   ])
    // }
    // else if (layouts) {
    //   updates.forEach((layout) => {
    //     let p = params.get(layout.name) as IPosition;
    //     if (p) {
    //       console.log('init ' + layout.name + ' params', p)
    //       layout.location = positionToRect(p, width, height);
    //       layouts.set(layout.name, layout);
    //     }
    //   });
    // }
    // return layouts;
  }

  function create(name: string, params: Params, layouts: Layouts, position: IPosition): ILayout {
    const width = params.get('width') as number;
    const height = params.get('height') as number;
    const itemHeight = params.get('itemHeight') as number;

    const LastItemVerticalOffset = params.get('LastItemVerticalOffset') as number;

    if (!position) {
      position = {
        units: {origin: IOrigin.leftTop, location: IUnit.pixel, size: IUnit.pixel},
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