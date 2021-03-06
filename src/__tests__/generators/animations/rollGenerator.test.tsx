import * as React from 'react'

import { rollGenerator } from '../../../generators/animations/rollGenerator'
import { Layout } from '../../../Layout'
import { mount } from 'enzyme'
import { DebugOptions } from '../../../types'

const g = rollGenerator('rollGenerator')

describe('Layout', () => {
  test('it should generate <div instance #1', () => {
    g.params().set('containersize', { width: 1000, height: 1000 })
    const wrapper = mount(
      <Layout
        name="instance#1"
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 100 }}
        animate={{ active: true }}
      >
        <div
          data-layout={{
            name: 'block',

            location: { left: 200, y: 50, width: 200, height: 200 }
          }}
        >
          <span>A test</span>
        </div>
      </Layout>
    )

    const block = wrapper
      .find("[id='block']")
      .at(0)
      .instance()
    // if (hello) {
    //   console.log('hello:', hello)
    // }

    expect(block).toBeTruthy()
  })
})
