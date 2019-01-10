import * as React from 'react'
// import * as ReactDOM from 'react-dom'

import { Params } from '../components/Params'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { RLGLayout } from '../RLGLayout'
// import { DebugOptions } from '../types'

import { shallow } from 'enzyme';

const params = new Params({
  name: 'layoutTest',
  initialValues: [['containersize', { width: 1000, height: 1000 }]]
})

function init(_g: IGenerator) {
  return _g.blocks()
}

function create(args: ICreate) {
  let block
  const blocks = args.g.blocks()
  if (blocks) {
    block = blocks.set('test', args.position, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

describe('RLGLayout', () => {
  test('it should', () => {
    const layout = shallow(<RLGLayout key='test' name='test' g = { g } />)
    expect((layout.instance() as RLGLayout).getBoundingLeftTop() === {x: 0, y: 0})
  });
})