import * as React from 'react'

import { dynamicGenerator } from '../../generators/dynamicGenerator'
import { RLGLayout } from '../../RLGLayout';
import { mount } from 'enzyme';
import { DebugOptions } from '../../types';

const g = dynamicGenerator('dynamicGenerator')

describe('RLGLayout', () => {

  test('it should generate <div instance #1', () => {
    g.params().set('containersize', { width: 1000, height: 1000 });
    const wrapper = mount(
      <RLGLayout name='instance#1' debug={DebugOptions.none} g={g} containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'header', 
          position: {
            location: { left: 200, top: 50, width: 200, height: 200 }
          }
        }}>
          <span>A test</span>
        </div>
      </RLGLayout>
    )

    const hello = wrapper.find("[id='header']").at(0).instance();
    // if (hello) {
    //   console.log('hello:', hello)
    // }

    expect(hello).toBeTruthy()
  })
  test('it should generate <div instance #2', () => {
    g.params().set('containersize', { width: 1000, height: 1000 });
    g.blocks().set('alpha', {
      location: { left: 200, top: 50, width: 200, height: 200 }
    }, g)
    const wrapper = mount(
      <RLGLayout
        name='instance#2'
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'block',
          position: {
            location: { left: 200, top: 50, width: 200, height: 200 }
          }
        }}>
          <span>A test</span>
        </div>
        <div data-layout={{
          name: 'block2',
          position: {
            location: { left: 200, top: 50,  width: 200, height: 200 }
          }
        }}>
          <span>A test 2</span>
        </div>
      </RLGLayout>
    )

    const test1 = wrapper.find("[id='block']").at(0).instance();
    const test2 = wrapper.find("[id='block2']").at(0).instance();
    expect(test1 && test2).toBeTruthy()
  })
})