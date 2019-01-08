import Block from '../components/Block'
import Blocks from '../components/Blocks'
import Params from '../components/Params'
import Generator, { ICreate, IGenerator } from '../generators/Generator'
import { Unit } from '../types'

const params = new Params({
  name: 'layoutTest',
  initialValues: [['containersize', { width: 1000, height: 1000 }]]
})

function init(g: IGenerator) {
  return g.layouts()
}

function create(args: ICreate) {
  let layout

  const layouts = args.g.layouts()

  if (layouts) {
    layout = layouts.set(args.name, args.position, g)
  }

  return layout
}

const g: IGenerator = new Generator('test', init, params, create)

it('Layouts index returns the correct key value #1', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }
  const t: Block = new Block('test', p, g)
  const l = new Blocks([['a', t]])
  expect(l.find(0)).toBe(t)
})

it('Layouts index returns the correct key value #2', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set('t', p, g)
  const t2 = l.set('t2', p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index returns the correct key value #3', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }

  const l = new Blocks([])

  l.set('t1', p, g)
  const t2: Block = l.set('t2', p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index returns the correct key value #4', () => {
  const p = {
    units: {
      origin: { x: 0, y: 0 },
      location: Unit.pixel,
      size: Unit.pixel
    },
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set('t1', p, g)
  const t2 = l.set('t2', p, g)
  l.set('t3', p, g)

  expect(l.find(1)).toBe(t2)
})
