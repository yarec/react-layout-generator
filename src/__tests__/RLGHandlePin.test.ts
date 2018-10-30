import RLGHandle, { RLGHandleProps } from '../RLGHandle';
import { IBounds } from '../RLGQuadTree';
import { Params, PositionRef, scalarWidthUpdate } from '../LayoutGenerator';

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
    location: {
      left: 100,
      top: 100,
      right: 200,
      bottom: 200
    }
  },
  boundary: { left: 0, top: 0, right: 500, bottom: 500 },
  onUpdate: () => { }
}

it('returns pinned value for PositionRef.rect.*', () => {
  const h = new RLGHandle(props);
  const bounds: IBounds = {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    subWidth: 50,
    subHeight: 50,
    right: 200,
    bottom: 200
  }
  expect(h.pin({top: 100, left: -10, bottom: 200, right: 90}, 
    PositionRef.rect, bounds)).toEqual({
    top: 100, left: 0, bottom: 200, right: 100
  });
  expect(h.pin({top: -10, left: 100, bottom: 90, right: 200}, 
    PositionRef.rect, bounds)).toEqual({
    top: 0, left: 100, bottom: 100, right: 200
  });
  expect(h.pin({top: 100, left: 450, bottom: 200, right: 550}, 
    PositionRef.rect, bounds)).toEqual({
    top: 100, left: 400, bottom: 200, right: 500
  });
  expect(h.pin({top: 450, left: 450, bottom: 550, right: 550}, 
    PositionRef.rect, bounds)).toEqual({
    top: 400, left: 400, bottom: 500, right: 500
  });
  expect(h.pin({top: -10, left: -10, bottom: 90, right: 90}, 
    PositionRef.rect, bounds)).toEqual({
    top: 0, left: 0, bottom: 100, right: 100
  });
});

it('returns pinned value for PositionRef.scalar.*', () => {
  const h = new RLGHandle(props);
  const bounds: IBounds = {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    subWidth: 50,
    subHeight: 50,
    right: 200,
    bottom: 200
  }
  expect(h.pin(250, PositionRef.scalar_width_left, bounds)).toBe(200);
  expect(h.pin(450, PositionRef.scalar_width_right, bounds)).toBe(400);
  expect(h.pin(250, PositionRef.scalar_height_top, bounds)).toBe(200);
  expect(h.pin(450, PositionRef.scalar_height_bottom, bounds)).toBe(400);
});

