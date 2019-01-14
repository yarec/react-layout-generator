import { Block } from '../../components/Block'
import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'
import { Unit } from '../../types'

const params = new Params({
  name: 'layoutTest',
  initialValues: [['containersize', { width: 1000, height: 1000 }]]
})

function init(_g: IGenerator) {
  return _g.blocks()
}

function create(args: ICreate) {
  let block
  const blocks = args.g.blocks()
  if (blocks) {
    block = blocks.set('test', args.position, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

it('location #1 - default units', () => {
  const p = {
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }

  const l = new Block('test', p, g)
  expect(l.fromLocation()).toEqual({ x: 0, y: 10 })
})

it('location #2 - location in percent', () => {
  const p = {
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.fromLocation()).toEqual({ x: 500, y: 500 })
})

it('location #3', () => {
  const p = {
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.fromLocation()).toEqual({ x: 500, y: 500 })
})

it('location #4', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.fromLocation()).toEqual({ x: 495, y: 495 })
})

it('size #1', () => {
  const p = {
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.fromSize()).toEqual({ width: 100, height: 10 })
})

it('size #2', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.fromSize()).toEqual({ width: 100, height: 10 })
})

it('size #3', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 100, height: 100 }
  }
  const l = new Block('test', p, g)
  expect(l.fromSize()).toEqual({ width: 100, height: 100 })
})

it('size #4', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.percent,
      size: Unit.percent
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.fromSize()).toEqual({ width: 100, height: 100 })
})

it('rect #1', () => {
  const p = {
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect()).toEqual({ x: 0, y: 10, width: 100, height: 10 })
})

it('rect #2', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 500, y: 500 },
    size: { width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect()).toEqual({ x: 450, y: 495, width: 100, height: 10 })
})

it('rect #3', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 50, y: 50 },
    size: { width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect()).toEqual({ x: 450, y: 495, width: 100, height: 10 })
})

it('rect #4', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.percent,
      size: Unit.percent
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 5 }
  }
  const l = new Block('test', p, g)
  expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 })
})

it('update #1', () => {
  const p = {
    origin: { x: 50, y: 50 },
    units: {
      location: Unit.percent,
      size: Unit.percent
    },
    location: { x: 50, y: 50 },
    size: { width: 10, height: 5 }
  }
  const l = new Block('test', p, g)
  l.update({ x: 450, y: 475 }, { width: 100, height: 50 })

  expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 })
})

it('update #2', () => {
  const p = {
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 250, y: 250 },
    size: { width: 100, height: 50 }
  }
  const l = new Block('test', p, g)
  l.update({ x: 250, y: 250 }, { width: 50, height: 50 })

  expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 })
})

it('update #3', () => {
  const p = {
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 250, y: 250 },
    size: { width: 100, height: 50 }
  }
  const l = new Block('test', p, g)
  l.update({ x: 250, y: 250 }, { width: 50, height: 50 })

  expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 })
})

it('align #1', () => {
  const p = {
    units: { location: Unit.pixel, size: Unit.pixel },
    location: { x: 100, y: 100 },
    size: { width: 100, height: 100 }
  }

  const pAlign = {
    units: { location: Unit.pixel, size: Unit.pixel },
    location: { x: 0, y: 0 },
    size: { width: 100, height: 80 },
    align: {
      key: 'one',
      offset: { x: 20, y: 0 },
      source: { x: 100, y: 0 },
      self: { x: 0, y: 50 }
    }
  }

  g.clear()
  const blocks = g.blocks()
  blocks.set('one', p, g)
  const bAlign = blocks.set('bAlign', pAlign, g)

  if (bAlign) {
    expect(bAlign.rect()).toEqual({ x: 220, y: 60, width: 100, height: 80 })
  } else {
    expect(bAlign).toEqual(undefined)
  }
})

it('misc #1', () => {
  const p = {
    units: {
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 250, y: 250 },
    size: { width: 100, height: 50 }
  }
  const b = new Block('test', p, g)
  b.update({ x: 250, y: 250 }, { width: 50, height: 50 })

  expect(b.location).toEqual({ x: 250, y: 250 })
  expect(b.size).toEqual({ width: 50, height: 50 })
  expect(b.resize).toBeTruthy()
  expect(b.generator).toBeTruthy()
})

it('misc #2', () => {
  const p = {
    units: {
      location: Unit.percent,
      size: Unit.pixel
    },
    location: { x: 250, y: 250 },
    size: { width: 100, height: 50 }
  }
  const b = new Block('test', p, g)
  b.update({ x: 250, y: 250 }, { width: 50, height: 50 })

  expect(b.noop).toBeTruthy()
  expect(b.connectionHandles()).toBeTruthy()
  expect(b.touch()).toEqual(undefined)
})
