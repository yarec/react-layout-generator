import Layout, {IPosition, IUnit} from '../components/Layout';
import Layouts from '../components/Layouts';
import Generator, {IGenerator} from '../generators/Generator';
import Params from '../components/Params';

const params = new Params([
  ['viewport', { width: 1000, height: 1000 }]
])

function init(g: IGenerator) {
  return g.layouts();
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

it('Layouts index returns the correct key value #3', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const t1: Layout = new Layout('t1', p, g);
  const t2: Layout = new Layout('t2', p, g);

  const l = new Layouts([]);
  l.set('t1', t1)

  l.set('t2', t2);

  expect(l.find(1)).toBe(t2);
});

it('Layouts index returns the correct key value #4', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const t1: Layout = new Layout('t1', p, g);
  const t2: Layout = new Layout('t2', p, g);
  const t3: Layout = new Layout('t3', p, g);

  const l = new Layouts([]);
  l.set('t1', t1)
  l.set('t2', t2);
  l.set('t3', t3)

  expect(l.find(1)).toBe(t2);
});




