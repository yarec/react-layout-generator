import { Params } from '../../components/Params'
import { Generator } from '../../generators/Generator'

const params = new Params({
  name: 'generatorTest',
  initialValues: [['containersize', { width: 0, height: 0 }]]
})

function init(g: Generator) {
  return g.blocks()
}

it('returns undefined with no blocks', () => {
  const g = new Generator('test', init, params)
  expect(g.lookup('x')).toBe(undefined)
})

it('generator #1', () => {
  const g = new Generator('test', init, params)
  expect(g.params()).toBeTruthy()
  expect(g.blocks()).toBeTruthy()
})

// it('generator #2', () => {
//   const g = new Generator('test', init, params)
//   expect(g.containersize('x')).toEqual({ width: 0, height: 0 })
//   expect(g.select()).toBe(undefined)
// })

it('generator #3', () => {
  const g = new Generator('test', init, params)
  expect(g.clear()).toBe(undefined)
  expect(g.editHelper()).toBe(undefined)
})

it('generator #4', () => {
  const p = {
    location: { x: 0, y: 10 },
    size: { width: 100, height: 10 }
  }

  const g = new Generator('test', init, params)
  expect(
    g.create({
      index: 0,
      count: 0,
      name: '',
      g: g,
      position: p
    })
  ).toBe(undefined)
})
