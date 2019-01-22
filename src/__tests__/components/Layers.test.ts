import { Block } from '../../components/Block'
import { Params } from '../../components/Params'
import { Generator, IGenerator } from '../../generators/Generator'

function init(g: IGenerator) {
  return g.blocks()
}

it('Layers #1', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)

  const layers = g.layers()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }

  const block = new Block('b', p, g)
  expect(layers.sendBackward(block)).toBe(10)
})

it('Layers #2', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const layers = g.layers()

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 5
  }

  const blocks = g.blocks()
  blocks.set('b', pb, g)

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 5
  }

  const block = blocks.set('a', p, g)
  expect(layers.sendBackward(block)).toBe(4)
})

it('Layers #3', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }
  blocks.set('a', pa, g)

  const layers = g.layers()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }

  const block = blocks.set('b', p, g)
  expect(layers.sendBackward(block)).toBe(9)
})

it('Layers #4', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 5
  }
  blocks.set('b', pb, g)

  const layers = g.layers()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 7
  }

  const block = blocks.set('c', p, g)
  expect(layers.sendBackward(block)).toBe(4)
})

it('Layers #5', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 5
  }
  blocks.set('b', pb, g)

  const layers = g.layers()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 7
  }

  const block = blocks.set('c', p, g)
  expect(layers.bringForward(block)).toBe(11)
})

it('Layers #6', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 5
  }
  blocks.set('b', pb, g)

  const layers = g.layers()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 7
  }

  const block = blocks.set('c', p, g)
  layers.bringFront(block)
  expect(block.layer).toBe(11)
})

it('Layers #7', () => {
  const params = new Params({
    name: 'layersTest',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const g: IGenerator = new Generator('test', init, params)
  const blocks = g.blocks()

  const pa = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 10
  }
  blocks.set('a', pa, g)

  const pb = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 5
  }
  blocks.set('b', pb, g)

  const layers = g.layers()

  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 },
    layer: 7
  }

  const block = blocks.set('c', p, g)
  layers.sendBack(block)
  expect(block.layer).toBe(4)
})
