import { createLine } from '../../geometry/line'
import { Params } from '../../components/Params'
import { IGenerator, ICreate, Generator } from '../../generators/Generator'
import gViewport from '../../global/viewport'
import { createExPoint } from '../../geometry/point'

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

const Line = createLine(g)
type Line = InstanceType<typeof Line>

it('Line #1', () => {
  const x = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  expect(x.start).toEqual({ x: 0, y: 0 })
})

it('Line #2', () => {
  const x = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  expect(x.end).toEqual({ x: 200, y: 100 })
})

it('Line #3', () => {
  const x = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  const p1 = x.start
  const p2 = x.end
  expect(x.length).toEqual(
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  )
})

it('Distance #1', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  expect(line.distance(line.start.x, line.start.y)).toEqual(0)
})

it('Distance #2', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  expect(line.distance(line.end.x, line.end.y)).toEqual(line.length)
})

it('Distance #3', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  const p = new ExPoint({ x: '-100%', y: '-100%' })
  expect(line.distance(p.getX(), p.getY())).toEqual(-line.length)
})

it('Distance #4', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )
  const p = new ExPoint({ x: '200%', y: '200%' })
  expect(line.distance(p.getX(), p.getY())).toEqual(2 * line.length)
})

it('Distance #5', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )

  expect(line.distance(10, 100)).toBeFalsy()
})

it('Intersects #1', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )

  expect(line.intersects(10, 100)).toBeFalsy()
})

it('Intersects #2', () => {
  const line = new Line(
    new ExPoint({ x: 0, y: 0 }),
    new ExPoint({ x: '100%', y: '100%' })
  )

  expect(line.intersects(100, 50)).toBeTruthy()
})
