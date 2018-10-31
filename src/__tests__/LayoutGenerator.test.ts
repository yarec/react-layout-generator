import BasicLayoutGenerator, {positionToRect, rectToPosition, Params, ILayout} from '../LayoutGenerator';

const params = new Params([
  ['width', 0],
  ['height', 0]
])

function init(params: Params, layouts?: Map<string, ILayout>): Map<string, ILayout>  {
  if (!layouts) {
    const l: Map<string, ILayout> = new Map();
    return l;
  }
  return layouts;
}

it('returns undefined with no layouts', () => {
  const g = new BasicLayoutGenerator(name, init, params)
  expect(g.next()).toBe(undefined);
});

it('rectToPosition is the inverse of positionToRect', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }
  const p = rectToPosition(r, 500, 500);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});


