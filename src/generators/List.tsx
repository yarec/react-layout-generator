import BasicLayoutGenerator, { Params, ILayout, Layouts, ILayoutGenerator, } from '../LayoutGenerator';
import { Point, Rect } from '../types';
import Position, {IPosition, IUnit} from '../Position'
// import { height } from 'lib/src/types';

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
   
    let updates: Array<ILayout> = params.updates();

    if (!layouts) {
      const title = function (): ILayout {
        let location = new Rect ({
          left: 0,
          top: 0,
          right: viewport.x,
          bottom: titleHeight
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

  function create(index: number, name: string, g: ILayoutGenerator, position: IPosition): ILayout {
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

    console.log('create', p.rect())

    // Update offset for next item
    params.set('LastItemVerticalOffset', LastItemVerticalOffset + p.fromSize().y); 

    const box: ILayout = {
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

  return new BasicLayoutGenerator(name, init, params, create);
}