import * as React from 'react'

import { columnsGenerator } from '../../generators/columnsGenerator'
import { Layout } from '../../Layout'
import { mount } from 'enzyme'
import { DebugOptions } from '../../types'

const g = columnsGenerator('columnsGenerator')

describe('Layout', () => {
  test('it should generate <div instance #1', () => {
    g.params().set('containersize', { width: 1000, height: 1000 })
    const wrapper = mount(
      <Layout
        name="instance#3"
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 500 }}
      >
        <div
          data-layout={{
            name: 'hello',

            location: { left: 200, y: 50, width: 200, height: 200 }
          }}
          style={{ backgroundColor: 'tan' }}
        >
          <span>hello</span>
        </div>
      </Layout>
    )

    const hello = wrapper
      .find("[id='hello']")
      .at(0)
      .instance()
    // if (hello) {
    //   console.log('hello:', hello)
    // }

    expect(hello).toBeTruthy()
  })
})
