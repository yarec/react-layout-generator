import Generator, { IGenerator } from './Generator';
import Layouts from '../components/Layouts';
import Layout, {IPosition} from '../components/Layout';
import Params from '../components/Params';

export default function RLGDiagram(name: string) {
  const params = new Params([
    ['width', 0],
    ['height', 0]
  ])

  function init(g: IGenerator): Layouts {
    const params = g.params();
    const layouts = g.layouts();

    if (params.changed()) {
      // update Layout for each update
      layouts.layouts.forEach((layout) => {
        layout.touch();
      });
    }
    return layouts;
  }

  function create(index: number, name: string, g: IGenerator, position: IPosition): Layout {
    // const width = params.get('width') as number;
    // const height = params.get('height') as number;

    if (!position) {
      console.error('TODO default position')
    }

    const box = new Layout('test', position, g)

    // const box: Layout = {
    //   name: name,
    //   editSize: [
    //     { positionRef: PositionRef.position, variable: name, update: positionUpdate },
    //     { positionRef: PositionRef.position_width_right, variable: name, update: positionWidthUpdate },
    //     { positionRef: PositionRef.position_height_bottom, variable: name, update: positionHeightUpdate }
    //   ],
    //   location: new Rect(p.rect())
    // }
    const layouts = g.layouts();
    if (layouts) {
      layouts.set(name, box);
    }
    return box;
  }

  return new Generator(name, init, params, create);
}
