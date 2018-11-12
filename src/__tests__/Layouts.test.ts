import Layout, {IPosition, IUnit} from '../components/Layout';
import Layouts from '../components/Layouts';
import Generator, {IGenerator} from '../generators/Generator';
import Params from '../components/Params';

const params = new Params([
  ['viewport', { width: 1000, height: 1000 }]
])

function init(g: IGenerator) {
}

function create(index: number, name: string, g: IGenerator, position: IPosition) {
  const layout = new Layout('test', position, g)

  const layouts = g.layouts();
  
  if (layouts) {
    layouts.set(name, layout);
  }

  return layout;
}

const g: IGenerator = new Generator(name, init, params, create);

it('Layouts index returns the correct key value #1', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const t: Layout = new Layout('test', p, g) 
  const l = new Layouts([['a', t]])
  expect(l.find(0)).toBe(t);
});

it('Layouts index returns the correct key value #2', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const t: Layout = new Layout('t', p, g);

  const l = new Layouts([['t', t]]);

  const t2: Layout = new Layout('t2', p, g) 

  l.set('t2', t2);

  expect(l.find(1)).toBe(t2);
});