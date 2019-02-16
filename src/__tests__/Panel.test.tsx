import * as React from 'react'

import { Params } from '../components/Params'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { Layout } from '../Layout'
import { DebugOptions, ServiceOptions } from '../types'

import * as Enzyme from 'enzyme'
import { Panel, IMetaDataArgs } from '../Panel'

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
    block = blocks.set(args.name, args.dataLayout, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

describe('Layout', () => {
  test('it should allow props to be set #1', () => {
    const wrapper = mount(
      <Layout
        name="test#1"
        service={ServiceOptions.edit}
        debug={DebugOptions.all}
        g={g}
      />
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.all)
  })

  test('Panel test #1', () => {
    g.reset()
    const wrapper = mount(
      <Layout
        name="panelTest#2"
        service={ServiceOptions.edit}
        g={g}
        containersize={{ width: 1000, height: 1000 }}
      >
        <Panel
          key={'a'}
          data-layout={{
            name: 'a',

            location: { left: 10, top: 10, width: 100, height: 100 }
          }}
        >
          {(args: IMetaDataArgs) => (
            <div>
              <span>Panel</span>
            </div>
          )}
        </Panel>
      </Layout>
    )

    const panel = wrapper
      .find(Panel)
      .at(0)
      .instance() as Panel

    expect(panel.props['data-layout'].name).toEqual('a')
    expect(wrapper.props().service).toEqual(ServiceOptions.edit)
  })
})
