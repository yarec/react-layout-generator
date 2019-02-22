import { createPiecewise } from '../../geometry/piecewise'
import gViewport from '../../global/viewport'
import { Params } from '../../components/Params'
import { IGenerator, ICreate, Generator } from '../../generators/Generator'
import { createExPoint } from '../../geometry/point'
import { createLine } from '../../geometry/line'

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

g.containersize({ width: 200, height: 200 })

const ExPoint = createExPoint(g)

const Line = createLine(g)
type Line = InstanceType<typeof Line>

const Piecewise = createPiecewise(g)
type Piecewise = InstanceType<typeof Piecewise>

it('Piecewise #1', () => {
  const line1 = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  const piecewise1 = new Piecewise([line1])
  expect(piecewise1.point(10)).toEqual({
    x: 7.0710678118654755,
    y: 7.0710678118654755
  })
})

it('Piecewise #2', () => {
  const line1 = new Line(
    new ExPoint({ x: 10, y: 0 }),
    new ExPoint({ x: 10, y: 20 })
  )
  const line2 = new Line(
    new ExPoint({ x: 10, y: 20 }),
    new ExPoint({ x: 30, y: 20 })
  )
  const piecewise1 = new Piecewise([line1, line2])
  expect(piecewise1.point(30)).toEqual({ x: 20, y: 20 })
})

it('Piecewise #3', () => {
  const line1 = new Line(
    new ExPoint({ x: 10, y: 0 }),
    new ExPoint({ x: 10, y: 20 })
  )
  const line2 = new Line(
    new ExPoint({ x: 10, y: 20 }),
    new ExPoint({ x: 30, y: 20 })
  )
  const line3 = new Line(
    new ExPoint({ x: 30, y: 20 }),
    new ExPoint({ x: 30, y: 0 })
  )
  const piecewise1 = new Piecewise([line1, line2, line3])
  expect(piecewise1.point(60)).toEqual(undefined)
})

it('Piecewise #4', () => {
  const line1 = new Line(
    new ExPoint({ x: 10, y: 0 }),
    new ExPoint({ x: 10, y: 20 })
  )
  const line2 = new Line(
    new ExPoint({ x: 10, y: 20 }),
    new ExPoint({ x: 30, y: 20 })
  )
  const line3 = new Line(
    new ExPoint({ x: 30, y: 20 }),
    new ExPoint({ x: 30, y: 0 })
  )
  const piecewise1 = new Piecewise([line1, line2, line3], true)
  expect(piecewise1.point(60)).toEqual({ x: 10, y: 0 })
})
