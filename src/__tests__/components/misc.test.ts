import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'
import { IDataLayout } from '../../components/blockTypes'

const params = new Params({
  name: 'layoutTest',
  initialValues: [
    ['containersize', { width: 1000, height: 1000 }],
    ['containerlefttop', { x: 100, y: 50 }],
    ['viewport', { width: 1000, height: 1000 }]
  ]
})

// const bounds: IBounds = {
//   container: { width: 1000, height: 1000 },
//   viewport: { width: 1000, height: 1000 }
// }

function init(_g: IGenerator) {
  return _g.blocks()
}

function create(args: ICreate) {
  let block
  const blocks = args.g.blocks()
  if (blocks) {
    block = blocks.set(args.name, args.dataLayout, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

it('align #1', () => {
  const p: IDataLayout = {
    location: { left: 100, top: 100, width: 100, height: 100 }
  }

  const pAlign: IDataLayout = {
    location: { left: 0, top: 0, width: 100, height: 80 },
    align: {
      key: 'one',
      offset: { x: 20, y: 0 },
      source: { x: 100, y: 0 },
      self: { x: 0, y: 50 }
    }
  }

  // g.clear()
  const blocks = g.blocks()
  blocks.set('one', p, g)
  const bAlign = blocks.set('bAlign', pAlign, g)

  if (bAlign) {
    expect(bAlign.rect).toEqual({ x: 220, y: 60, width: 100, height: 80 })
  } else {
    expect(bAlign).toEqual(undefined)
  }
})
