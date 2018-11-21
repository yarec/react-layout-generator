import Params from '../components/Params';
import Generator from '../generators/Generator';

const params = new Params([
  ['viewport', {width: 0, height: 0}]
])

function init(g: Generator)  {
  return g.layouts();
}

it('returns undefined with no layouts', () => {
  const g = new Generator(name, init, params)
  expect(g.next()).toBe(undefined);
});



