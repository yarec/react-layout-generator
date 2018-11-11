import RLGHandle, { RLGHandleProps } from '../RLGHandle';
import Params from '../components/Params';
import { Rect } from 'src/types';

const height = 500;
const width = 500;

const params = new Params([
  ['width', width],
  ['height', height]
])

// function init(params: Params, layouts?: Map<string, ILayout>): Map<string, ILayout> {
//   if (!layouts) {
//     const l: Map<string, ILayout> = new Map();
//     return l;
//   }
//   return layouts;
// }


const props: RLGHandleProps = {
  rlgDrag: { cursor: 'w-resize', x: 250, y: 250, width: 100, height: 100 },
  params: params,
  edit: { positionRef: PositionRef.scalar_width_right, variable: 'item', update: scalarWidthUpdate },
  layout: {
    name: 'leftSide',
    editSize: [{ positionRef: PositionRef.scalar_width_right, variable: 'item', update: scalarWidthUpdate }],
    location: new Rect({
      x: 100,
      y: 100,
      width: 200,
      height: 200
    })
  },
  boundary: { x: 0, y: 0, width: 500, height: 500 },
  onUpdate: () => { }
}

it('returns extend value for PositionRef.rect #1', () => {
  const h = new RLGHandle(props);
  expect(h.extend({ top: 100, left: -10, bottom: 200, right: 90 },
    PositionRef.rect)).toEqual({
      x: 100, y: -10, height: 100, width: 100
    });
});