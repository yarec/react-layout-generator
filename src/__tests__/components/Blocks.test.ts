import { Block } from '../../components/Block'
import { Blocks } from '../../components/Blocks'
import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'
// import { Unit } from '../../types'

const params = new Params({
  name: 'layoutTest',
  initialValues: [['containersize', { width: 1000, height: 1000 }]]
})

function init(g: IGenerator) {
  return g.blocks()
}

function create(args: ICreate) {
  let block

  const blocks = args.g.blocks()

  if (blocks) {
    block = blocks.set(args.name, args.dataLayout, g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

it('Layouts index returns the correct key value #1', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const t: Block = new Block('test', p, g)
  const l = new Blocks([['a', t]])
  expect(l.find(0)).toBe(t)
})

it('Layouts index returns the correct key value #2', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set('t', p, g)
  const t2 = l.set('t2', p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index returns the correct key value #3', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])

  l.set('t1', p, g)
  const t2: Block = l.set('t2', p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index returns the correct key value #4', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set('t1', p, g)
  const t2 = l.set('t2', p, g)
  l.set('t3', p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index updates the block #1', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set('t1', p, g)

  const p2 = {
    location: { left: 110, top: 110, width: 100, height: 10 }
  }

  l.set('t1', p2, g)

  const updatedBlock = l.get('t1')
  const blockRect = updatedBlock ? updatedBlock.blockRect : undefined

  expect(blockRect && blockRect.left).toBe(110)
})

it('Layouts layers returns the valid layers #1', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set('t1', p, g)
  l.set('t2', p, g)
  l.set('t3', p, g)

  const blocks = l.layers(0)
  expect(blocks && blocks.length).toBe(3)
})

it('Layouts layers returns the valid layers #2', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  const b1 = l.set('t1', p, g)
  b1.setHandler('$layer', 1)

  l.set('t2', p, g)
  l.set('t3', p, g)

  const blocks1 = l.layers(0)
  expect(blocks1 && blocks1.length).toBe(2)

  const blocks2 = l.layers(1)
  expect(blocks2 && blocks2.length).toBe(1)

  const blocks3 = l.layers(2)
  expect(blocks3 && blocks3.length).toBe(0)
})
