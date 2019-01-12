import * as React from 'react'

import { desktopGenerator } from '../../generators/desktopGenerator'
import { RLGLayout } from '../../RLGLayout';
import { mount } from 'enzyme';
import { DebugOptions } from '../../types';

const g = desktopGenerator('desktopGenerator')

describe('RLGLayout', () => {

  test('it should generate <div instance #1', () => {
    g.params().set('containersize', { width: 1000, height: 1000 });
    const wrapper = mount(
      <RLGLayout name='instance#1' debug={DebugOptions.none} g={g} containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{ name: 'header' }}>
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
})