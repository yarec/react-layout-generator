import Params from '../components/Params'
import Generator from '../generators/Generator'

const params = new Params({
  name: 'generatorTest',
  initialValues: [['containersize', { width: 0, height: 0 }]]
})

function init(g: Generator) {
  return g.blocks()
}

it('returns undefined with no blocks', () => {
  const g = new Generator('test', init, params)
  expect(g.next()).toBe(undefined)
})
