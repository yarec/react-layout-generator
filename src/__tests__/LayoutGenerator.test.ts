import BasicLayoutGenerator, {Params, Layouts} from '../LayoutGenerator';

const params = new Params([
  ['width', 0],
  ['height', 0]
])

function init(params: Params, layouts?: Layouts): Layouts  {
  if (!layouts) {
    return new Layouts([]);
  }
  return layouts;
}

it('returns undefined with no layouts', () => {
  const g = new BasicLayoutGenerator(name, init, params)
  expect(g.next()).toBe(undefined);
});



