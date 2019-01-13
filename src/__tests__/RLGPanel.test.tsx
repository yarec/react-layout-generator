import * as React from 'react'

import { Params } from '../components/Params'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { RLGLayout } from '../RLGLayout'
import { DebugOptions, EditOptions } from '../types'

import * as Enzyme from 'enzyme';
import { RLGPanel, IRLGPanelArgs } from '../RLGPanel';

const { mount } = Enzyme

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
    block = blocks.set(args.name, args.position, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

describe('RLGLayout', () => {
  test('it should allow props to be set #1', () => {
    const wrapper = mount(<RLGLayout name='test#1' edit={EditOptions.all} debug={DebugOptions.all} g={g} />)
    expect(wrapper.props().debug).toEqual(DebugOptions.all);
  });

  test('RLGPanel test #1', () => {
    const wrapper = mount(
      <RLGLayout name='panelTest#1' edit={EditOptions.all} g={g} >
        <RLGPanel
          key={'a'}
          data-layout={{ name: 'a' }}
        >
          {(args: IRLGPanelArgs) => (
            <div>
              <span >Panel</span>
            </div>
          )}
        </RLGPanel>
      </RLGLayout>
    )
    expect(wrapper.props().edit).toEqual(EditOptions.all);
  });
})