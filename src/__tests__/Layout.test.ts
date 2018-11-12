import Layout, { IPosition, IUnit } from '../components/Layout';
import Params from '../components/Params';
import Generator, { IGenerator } from '../generators/Generator';

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


it('location #1 - default units', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }

  const l = new Layout('test', p, g);
  expect(l.fromLocation()).toEqual({ x: 0, y: 10 });
});

it('location #2 - location in percent', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromLocation()).toEqual({ x: 500, y: 500 });
});

it('location #3', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromLocation()).toEqual({ x: 500, y: 500 });
});

it('location #4', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromLocation()).toEqual({ x: 495, y: 495 });
});

it('size #1', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromSize()).toEqual({ width: 100, height: 10 });
});

it('size #2', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromSize()).toEqual({ width: 100, height: 10 });
});

it('size #3', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 100, height: 100 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromSize()).toEqual({ width: 100, height: 100 });
});

it('size #4', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.percent
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.fromSize()).toEqual({ width: 100, height: 100 });
});

it('rect #1', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.rect()).toEqual({x: 0, y: 10, width: 100, height: 10});
});

it('rect #2', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 500, y: 500 },
    size: { width: 100, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.rect()).toEqual({ x: 450, y: 495, width: 100, height: 10 });
});

it('rect #3', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 100, height: 10 }
  };
  const l = new Layout('test', p, g);
  expect(l.rect()).toEqual({ x: 450, y: 495, width: 100, height: 10 });
});

it('rect #4', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.percent
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 5 }
  };
  const l = new Layout('test', p, g);
  expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 });
});

it('update #1', () => {
  const p = {
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.percent
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 5 }
  };
  const l = new Layout('test', p, g);
  l.update({ x: 450, y: 475 }, { width: 100, height: 50 });

  expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50  });
});

it('update #2', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 250, y: 250 },
    size: { width: 100, height: 50 }
  };
  const l = new Layout('test', p, g);
  l.update({ x: 250, y: 250 }, { width: 50, height: 50 });

  expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50  });
});

it('update #3', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 250, y: 250 },
    size: { width: 100, height: 50 }
  };
  const l = new Layout('test', p, g);
  l.update({ x: 250, y: 250 }, { width: 50, height: 50 });

  expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 });
});


