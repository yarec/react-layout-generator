import Generator, { IGenerator, } from '../generators/Generator';
import { Point, Rect } from '../types';
import Position, {IPosition, IUnit} from '../components/Position';
import Params from '../components/Params';
import Layouts from '../components/Layouts';
import Layout from '../components/Layout';

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
    const viewport = params.get('viewport') as Point;
   
    let updates: Array<Layout> = params.updates();

    if (!layouts) {
      const title = function (): Layout {
        let location = new Rect ({
          x: 0,
          y: 0,
          width: viewport.x,
          height: titleHeight
        })
  
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
        let p = params.get(layout.name) as Position;
        if (p) {
          // console.log('init ' + layout.name + ' params', p)
          layout.location = new Rect(p.rect()); 
          layouts.set(layout.name, layout);
        }
      });
    }
    return layouts;
  }

  function create(index: number, name: string, g: IGenerator, position: IPosition): ILayout {
    const viewport = params.get('viewport') as Point;
    // const height = params.get('height') as number;
    const itemHeight = params.get('itemHeight') as number;

    let p: Position;
    if (!position) {
      p = new Position({
        units: {
          origin: {x: 0, y: 0},
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        align: {
          key: index-1,
          offset: {x: 0, y: 0},
          source: {x: 0, y: 100},
          self: {x: 0, y: 0}
        },
        location: {x: 0, y: 0},
        size: {x: viewport.x, y: itemHeight}
      }, g)
    } else {
      p = new Position(position, g);
    }

    const LastItemVerticalOffset = params.get('LastItemVerticalOffset') as number;

    // p.update({x: 0, y: LastItemVerticalOffset}, {x: , y: height(});

    // console.log('create', p.rect())

    // Update offset for next item
    params.set('LastItemVerticalOffset', LastItemVerticalOffset + p.fromSize().y); 

    const box: Layout = {
      name: name,
      location: new Rect(p.rect())
    }

    // Insert layout
    g.layouts()!.set(box.name, box);
    // Update params
    params.set(name, p);

    // return layout
    return box;
  }

  return new Generator(name, init, params, create);
}