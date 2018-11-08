import Position, { IPosition, IUnit} from '../Position';
import BasicLayoutGenerator, { Params, Layouts, ILayoutGenerator, ILayout } from '../LayoutGenerator';
import { Rect } from '../types'

const params = new Params([
  ['viewport', {x: 1000, y: 1000}]
])

function init(params: Params, layouts?: Layouts): Layouts {
  if (!layouts) {
    return new Layouts([]);
  }
  return layouts;
}

function create(index: number, name: string, g: ILayoutGenerator, position: IPosition): ILayout {
  const p = new Position(position, g)

  const box: ILayout = {
    name: name,
    location: new Rect(p.rect())
  }

  const layouts = g.layouts();
  const params = g.params();
  if (layouts) {
    layouts.set(box.name, box);
  }
  params.set(name, p);
  return box;
}

const g: ILayoutGenerator = new BasicLayoutGenerator(name, init, params, create);


it('location #1 - default units', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { x: 100, y: 10 }
  }, g);

  expect(ref.fromLocation()).toEqual({x: 0, y: 10});
});

it('location #2 - location in percent', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { x: 10, y: 10 }
  }, g);

  expect(ref.fromLocation()).toEqual({x: 500, y: 500});
});

it('location #3', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { x: 10, y: 10 }
  }, g);

  expect(ref.fromLocation()).toEqual({x: 500, y: 500});
});

it('location #4', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { x: 10, y: 10 }
  }, g);

  expect(ref.fromLocation()).toEqual({x: 495, y: 495});
});

it('size #1', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { x: 100, y: 10 }
  }, g);

  expect(ref.fromSize()).toEqual({x: 100, y: 10});
});

it('size #2', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { x: 100, y: 10 }
  }, g);

  expect(ref.fromSize()).toEqual({x: 100, y: 10});
});

it('size #3', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { x: 100, y: 100 }
  }, g);

  expect(ref.fromSize()).toEqual({x: 100, y: 100});
});

it('size #4', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.percent
    },
    location: { x: 50, y: 50 },
    size: { x: 10, y: 10 }
  }, g);

  expect(ref.fromSize()).toEqual({x: 100, y: 100});
});

it('rect #1', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 0, y: 10 },
    size: { x: 100, y: 10 }
  }, g);

  expect(ref.rect()).toEqual({left: 0, top: 10, right: 100, bottom: 20});
});

it('rect #2', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 500, y: 500 },
    size: { x: 100, y: 10 }
  }, g);

  expect(ref.rect()).toEqual({left: 450, top: 495, right: 550, bottom: 505});
});

it('rect #3', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 50, y: 50 },
    size: { x: 100, y: 10 }
  }, g);

  expect(ref.rect()).toEqual({left: 450, top: 495, right: 550, bottom: 505});
});

it('rect #4', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.percent
    },
    location: { x: 50, y: 50 },
    size: { x: 10, y: 5 }
  }, g);

  expect(ref.rect()).toEqual({left: 450, top: 475, right: 550, bottom: 525});
});

it('update #1', () => {
  const ref = new Position({
    units: {
      origin: { x: 50, y: 50 },
      location: IUnit.percent,
      size: IUnit.percent
    },
    location: { x: 50, y: 50 },
    size: { x: 10, y: 5 }
  }, g);

  ref.update({x: 450, y: 475}, {x: 100, y: 50});

  expect(ref.rect()).toEqual({left: 450, top: 475, right: 550, bottom: 525});
});

it('update #2', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.pixel,
      size: IUnit.pixel
    },
    location: { x: 250, y: 250 },
    size: { x: 100, y: 50 }
  }, g);

  ref.update({x: 250, y: 250}, {x: 50, y: 50});

  expect(ref.rect()).toEqual({left: 250, top: 250, right: 300, bottom: 300});
});

it('update #3', () => {
  const ref = new Position({
    units: {
      origin: { x: 0, y: 0 },
      location: IUnit.percent,
      size: IUnit.pixel
    },
    location: { x: 250, y: 250 },
    size: { x: 100, y: 50 }
  }, g);

  ref.update({x: 250, y: 250}, {x: 50, y: 50});

  expect(ref.rect()).toEqual({left: 250, top: 250, right: 300, bottom: 300});
});


