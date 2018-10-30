import BasicLayoutGenerator, {Params, ILayout} from '../LayoutGenerator';

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


