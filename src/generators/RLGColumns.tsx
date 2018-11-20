import Generator, { IGenerator, ICreate } from '../generators/Generator';
import { ISize } from '../types';
import Params from '../components/Params';
import Layouts from '../components/Layouts';
import Layout, { IUnit } from '../components/Layout';

export default function RLGColumns(name: string) {

  const defaultItemWidth = 100;

  const params = new Params([
    ['viewport', { width: 0, height: 0 }],
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['defaultItemWidth', defaultItemWidth]
  ])

  function init(g: IGenerator): Layouts {
    // console.log(`centerColumns: init `)
    const params = g.params();
    const layouts = g.layouts();

    const align = params.get('align') as number;

    //if (params.changed()) {
      
      // update Layout for each update
      if (align === 0) {
        console.log(`centerColumns init ${layouts.size}`)
        centerColumns(layouts, params);

        // layouts.map.forEach((layout) => {
        //   console.log(`centerColumns ${layout.name} ${layout.rect().x}`)
        // });
      }
    //}

    return layouts;
  }

  /**
   * Align items in center
   */
  function centerColumns(layouts: Layouts, params: Params) {

    const viewport = params.get('viewport') as ISize;
    console.log(`centerColumns viewport ${viewport.width}`)

    // compute width of all columns
    let totalWidth = 0
    layouts.map.forEach((layout) => {
      totalWidth += layout.rect().width;
    });

    // compute beginning offset
    const offset0 = (viewport.width / 2 - totalWidth / 2) ;
    console.log(`centerColumns offset ${offset0} width: ${totalWidth}`)

    // update
    let currentWidths = 0;
    layouts.map.forEach((layout) => {
      const rect = layout.rect();
      layout.update({ x: offset0 + currentWidths, y: 0 }, { width: rect.width, height: viewport.height });
      currentWidths += rect.width;
      console.log(`centerColumns ${layout.name} x: ${layout.rect().x}`)
    });
  }

  function create(args: ICreate): Layout {
    // console.log(`centerColumns: create ${args.name}`)
    const params = args.g.params();
    const viewport = params.get('viewport') as ISize;
    const defaultItemWidth = params.get('defaultItemWidth') as number;

    const layouts = args.g.layouts();

    let p = args.position;
    if (!p) {
      p = {
        units: {
          origin: { x: 0, y: 0 },
          location: IUnit.pixel,
          size: IUnit.pixel
        },
        location: { x: 0, y: 0 },
        size: { width: defaultItemWidth, height: viewport.height }
      }
    }

    const l = new Layout(args.name, p, args.g);

    layouts.set(args.name, l);

    const align = params.get('align') as number;

    
    //if ((args.index + 1) === args.count) {
      
      if (align === 0) {
        console.log(`centerColumns: create`)
        centerColumns(layouts, params);
      }
    //}

    return l;
  }

  return new Generator(name, init, params, create);
}