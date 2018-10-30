import RLGHandle, { RLGHandleProps } from '../RLGHandle';
// import { IBounds } from '../RLGQuadTree';
import { Params, PositionRef, scalarWidthUpdate } from '../LayoutGenerator';
import { IRect } from '../types';

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

const item: IRect = {
  left: 100,
  top: 100,
  right: 200,
  bottom: 200
}

it('returns pinned value for PositionRef.rect #1', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ top: 100, left: -10, bottom: 200, right: 90 },
    PositionRef.rect, item)).toEqual({
      top: 100, left: 0, bottom: 200, right: 100
    });
});
it('returns pinned value for PositionRef.rect #2', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ top: -10, left: 100, bottom: 90, right: 200 },
    PositionRef.rect, item)).toEqual({
      top: 0, left: 100, bottom: 100, right: 200
    });
});
it('returns pinned value for PositionRef.rect #3', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ top: 100, left: 450, bottom: 200, right: 550 },
    PositionRef.rect, item)).toEqual({
      top: 100, left: 400, bottom: 200, right: 500
    });
});
it('returns pinned value for PositionRef.rect #4', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ top: 450, left: 450, bottom: 550, right: 550 },
    PositionRef.rect, item)).toEqual({
      top: 400, left: 400, bottom: 500, right: 500
    });
});
it('returns pinned value for PositionRef.rect #5', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ top: -10, left: -10, bottom: 90, right: 90 },
    PositionRef.rect, item)).toEqual({
      top: 0, left: 0, bottom: 100, right: 100
    });
});

it('returns pinned value for PositionRef.position #1', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ location: { x: 20, y: -2 }, size: { x: 100, y: 100 } }, // top: 100, left: -10, bottom: 200, right: 90}, 
    PositionRef.position, item)).toEqual({
      location: { x: 20, y: 10 }, size: { x: 100, y: 100 }
    });
});
it('returns pinned value for PositionRef.position #2', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ location: { x: -2, y: -2 }, size: { x: 100, y: 100 } },
    PositionRef.position, item)).toEqual({
      location: { x: 10, y: 10 }, size: { x: 100, y: 100 }
    });
});
it('returns pinned value for PositionRef.position #3', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ location: { x: 102, y: -2 }, size: { x: 100, y: 100 } },
    PositionRef.position, item)).toEqual({
      location: { x: 90, y: 10 }, size: { x: 100, y: 100 }
    });
});
it('returns pinned value for PositionRef.position #4', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ location: { x: 50, y: 102 }, size: { x: 100, y: 100 } },
    PositionRef.position, item)).toEqual({
      location: { x: 50, y: 90 }, size: { x: 100, y: 100 }
    });
});
it('returns pinned value for PositionRef.position #5', () => {
  const h = new RLGHandle(props);
  expect(h.pin({ location: { x: 102, y: 102 }, size: { x: 100, y: 100 } },
    PositionRef.position, item)).toEqual({
      location: { x: 90, y: 90 }, size: { x: 100, y: 100 }
    });
});

it('returns pinned value for PositionRef.scalar_width_left', () => {
  const h = new RLGHandle(props);
  expect(h.pin(250, PositionRef.scalar_width_left, item)).toEqual(200);
});
it('returns pinned value for PositionRef.scalar_width_right', () => {
  const h = new RLGHandle(props);
  expect(h.pin(450, PositionRef.scalar_width_right, item)).toEqual(400);
});
it('returns pinned value for PositionRef.scalar_height_top', () => {
  const h = new RLGHandle(props);
  expect(h.pin(250, PositionRef.scalar_height_top, item)).toEqual(200);
});
it('returns pinned value for PositionRef.scalar_height_bottom', () => {
  const h = new RLGHandle(props);
  expect(h.pin(450, PositionRef.scalar_height_bottom, item)).toEqual(400);
});


