import { createExPoint } from '../../geometry/point'
import { Params } from '../../components/Params'
import { IGenerator, ICreate, Generator } from '../../generators/Generator'
import gViewport from '../../global/viewport'

gViewport.width = 500
gViewport.height = 500

const params = new Params({
  name: 'layoutTest',
  initialValues: [['containersize', { width: 200, height: 100 }]]
})

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

g.containersize({ width: 200, height: 100 })

const ExPoint = createExPoint(g)

it('ExPoint #1', () => {
  const p = new ExPoint({ x: 10, y: 10 })
  expect(p.getPoint()).toEqual({ x: 10, y: 10 })
})

it('ExPoint #2', () => {
  const p = new ExPoint({ x: '100%', y: 10 })
  expect(p.getPoint()).toEqual({ x: 200, y: 10 })
})

it('ExPoint #3', () => {
  const p = new ExPoint({ x: '100vh', y: 10 })
  expect(p.getPoint()).toEqual({ x: 500, y: 10 })
})

it('ExPoint #4', () => {
  const p = new ExPoint({ x: '100vh', y: '100ph' })

  expect(p.getPoint()).toEqual({ x: 500, y: 100 })
})

it('ExPoint #5', () => {
  const p = new ExPoint({ x: '100vh', y: '100pw' })
  expect(p.getPoint()).toEqual({ x: 500, y: 200 })
})
