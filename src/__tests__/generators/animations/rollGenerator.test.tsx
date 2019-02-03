import * as React from 'react'

import { rollGenerator } from '../../../generators/animations/rollGenerator'
import { RLGLayout } from '../../../RLGLayout'
import { mount } from 'enzyme'
import { DebugOptions } from '../../../types'

const g = rollGenerator('rollGenerator')

describe('RLGLayout', () => {
  test('it should generate <div instance #1', () => {
    g.params().set('containersize', { width: 1000, height: 1000 })
    const wrapper = mount(
      <RLGLayout
        name="instance#1"
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 100 }}
        animate={{ active: true }}
      >
        <div
          data-layout={{
            name: 'block',
            position: {
              location: { x: 200, y: 50 },
              size: { width: 200, height: 200 }
            }
          }}
        >
          <span>A test</span>
        </div>
      </RLGLayout>
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