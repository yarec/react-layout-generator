import gViewport from '../../../global/viewport'
import { Params } from '../../../components/Params'
import { IGenerator, ICreate, Generator } from '../../../generators/Generator'

import { pathHook } from '../../../generators/animations/pathHook'
import { Block } from '../../../components/Block'
import { Hooks } from '../../../components/Hooks'
import { IDataLayout } from '../../../components/blockTypes'

gViewport.width = 500
gViewport.height = 500

const params = new Params({
  name: 'piecewiseHookTest',
  initialValues: [['containersize', { width: 500, height: 100 }]]
})

function init(_g: IGenerator) {
  return _g.blocks()
}

function create(args: ICreate) {
  let block = undefined
  const blocks = args.g.blocks()
  if (blocks) {
    block = blocks.set(args.name, args.dataLayout, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

g.containersize({ width: 200, height: 200 })

const p: IDataLayout = {
  name: 'test',
  location: { left: 0, top: 0, width: 100, height: 100 }
}
const input: Block[] = [new Block('test', p, g)]
const output: Block[] = []

function getBlocks() {
  return input
}

const hooks: Hooks = g.hooks()
hooks.set(
  'layer3',
  pathHook({
    prefix: 'layer3',
    points: [{ x: 0, y: 0 }, { x: '100%', y: 0 }],
    input: getBlocks,
    output: output,
    velocity: 0.1,
    anchor: { x: 0.1, y: 0 },
    placement: { x: 0, y: 0 },
    spacing: 200,
    g: g
  })
)

it('pathHook #1', () => {
  const params = g.params()
  params.set('animate', 1)
  params.set('deltaTime', 100)

  for (let i = 0; i < 20; i++) {
    hooks.run(g)
  }

  expect(output.length).toEqual(1)
})
