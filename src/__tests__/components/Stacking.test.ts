import { Block } from '../../components/Block'
import { Params } from '../../components/Params'
import { Generator, IGenerator } from '../../generators/Generator'

function init(g: IGenerator) {
  return g.blocks()
}

it('Stacking #1', () => {
  const params = new Params({
    name: 'StackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)

  const stacking = g.stacking()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }

  const block = new Block('b', p, g)
  expect(stacking.sendBackward(block)).toBe(10)
})

it('Stacking #2', () => {
  const params = new Params({
    name: 'stackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const stacking = g.stacking()

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 5
  }

  const blocks = g.blocks()
  blocks.set('b', pb, g)

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 5
  }

  const block = blocks.set('a', p, g)
  expect(stacking.sendBackward(block)).toBe(4)
})

it('Stacking #3', () => {
  const params = new Params({
    name: 'stackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }
  blocks.set('a', pa, g)

  const stacking = g.stacking()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }

  const block = blocks.set('b', p, g)
  expect(stacking.sendBackward(block)).toBe(9)
})

it('Stacking #4', () => {
  const params = new Params({
    name: 'stackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 5
  }
  blocks.set('b', pb, g)

  const stacking = g.stacking()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 7
  }

  const block = blocks.set('c', p, g)
  expect(stacking.sendBackward(block)).toBe(4)
})

it('Stacking #5', () => {
  const params = new Params({
    name: 'stackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 5
  }
  blocks.set('b', pb, g)

  const stacking = g.stacking()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 7
  }

  const block = blocks.set('c', p, g)
  expect(stacking.bringForward(block)).toBe(11)
})

it('Stacking #6', () => {
  const params = new Params({
    name: 'stackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 5
  }
  blocks.set('b', pb, g)

  const stacking = g.stacking()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 7
  }

  const block = blocks.set('c', p, g)
  stacking.bringFront(block)
  expect(block.zIndex).toBe(11)
})

it('Stacking #7', () => {
  const params = new Params({
    name: 'stackingTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 5
  }
  blocks.set('b', pb, g)

  const stacking = g.stacking()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    zIndex: 7
  }

  const block = blocks.set('c', p, g)
  stacking.sendBack(block)
  expect(block.zIndex).toBe(4)
})
