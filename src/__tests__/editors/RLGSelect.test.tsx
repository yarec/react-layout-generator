import * as React from 'react'
import * as Enzyme from 'enzyme';

import { RLGLayout } from '../../RLGLayout';
import { DebugOptions, EditOptions } from '../../types';
import { dynamicGenerator, Block } from '../../react-layout-generator';
import { RLGSelect } from '../../editors/RLGSelect';

const { mount } = Enzyme

const g = dynamicGenerator('example.CardDeck');

describe('RLGSelect', () => {
  test('RLGSelect #1', () => {
    g.clear()
    const wrapper = mount(
      <RLGLayout
        name='RLGSelect#1'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          position: {
            location: { x: 200, y: 50 },
            size: { width: 200, height: 200 }
          }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          position: {
            location: { x: 400, y: 50 },
            size: { width: 200, height: 200 }
          }
        }}>
          <span>two</span>
        </div>
      </RLGLayout>
    )

    // const layout = wrapper.instance() as RLGLayout

    const select = wrapper.find(RLGSelect).at(0).instance() as RLGSelect

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    const z1 = one.layer
    const z2 = two.layer

    select!.sendBack()

    expect(one.layer).toEqual(Math.max(0, Math.min(z1, z2) - 1))
    expect(two.layer).toEqual(Math.max(0, Math.min(z1, z2) - 1))
  })
  test('RLGSelect #2', () => {
    g.clear()
    const wrapper = mount(
      <RLGLayout
        name='RLGSelect#1'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          position: {
            location: { x: 200, y: 50 },
            size: { width: 200, height: 200 }
          }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          position: {
            location: { x: 400, y: 50 },
            size: { width: 200, height: 200 }
          }
        }}>
          <span>two</span>
        </div>
      </RLGLayout>
    )

    // const layout = wrapper.instance() as RLGLayout

    const select = wrapper.find(RLGSelect).at(0).instance() as RLGSelect

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    const z1 = one.layer
    const z2 = two.layer

    select!.bringFront()

    expect(one.layer).toEqual(Math.max(z1, z2) + 1)
    expect(two.layer).toEqual(Math.max(z1, z2) + 1)
  })
  test('RLGSelect #3', () => {
    g.clear()
    const wrapper = mount(
      <RLGLayout
        name='RLGSelect#1'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          position: {
            location: { x: 200, y: 200 },
            size: { width: 200, height: 200 }
          }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          position: {
            location: { x: 400, y: 250 },
            size: { width: 200, height: 100 }
          }
        }}>
          <span>two</span>
        </div>
      </RLGLayout>
    )

    // const layout = wrapper.instance() as RLGLayout

    const select = wrapper.find(RLGSelect).at(0).instance() as RLGSelect

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignBottom()

    expect(one.rect()).toEqual({ x: 200, y: 200, width: 200, height: 200 })
    expect(two.rect()).toEqual({ x: 400, y: 300, width: 200, height: 100 })
  })
  test('RLGSelect #4', () => {
    g.clear()
    const wrapper = mount(
      <RLGLayout
        name='RLGSelect#1'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          position: {
            location: { x: 200, y: 200 },
            size: { width: 100, height: 200 }
          }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          position: {
            location: { x: 400, y: 250 },
            size: { width: 200, height: 100 }
          }
        }}>
          <span>two</span>
        </div>
      </RLGLayout>
    )

    // const layout = wrapper.instance() as RLGLayout

    const select = wrapper.find(RLGSelect).at(0).instance() as RLGSelect

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignCenter()

    expect(one.rect()).toEqual({ x: 200, y: 200, width: 100, height: 200 })
    expect(two.rect()).toEqual({ x: 150, y: 250, width: 200, height: 100 })
  })
  test('RLGSelect #5', () => {
    g.clear()
    const wrapper = mount(
      <RLGLayout
        name='RLGSelect#1'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          position: {
            location: { x: 200, y: 200 },
            size: { width: 100, height: 200 }
          }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          position: {
            location: { x: 400, y: 250 },
            size: { width: 200, height: 100 }
          }
        }}>
          <span>two</span>
        </div>
      </RLGLayout>
    )

    // const layout = wrapper.instance() as RLGLayout

    const select = wrapper.find(RLGSelect).at(0).instance() as RLGSelect

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignLeft()

    expect(one.rect()).toEqual({ x: 200, y: 200, width: 100, height: 200 })
    expect(two.rect()).toEqual({ x: 200, y: 250, width: 200, height: 100 })
  })
  test('RLGSelect #6', () => {
    g.clear()
    const wrapper = mount(
      <RLGLayout
        name='RLGSelect#1'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'one',
          position: {
            location: { x: 200, y: 200 },
            size: { width: 100, height: 200 }
          }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          position: {
            location: { x: 400, y: 250 },
            size: { width: 200, height: 100 }
          }
        }}>
          <span>two</span>
        </div>
      </RLGLayout>
    )

    // const layout = wrapper.instance() as RLGLayout

    const select = wrapper.find(RLGSelect).at(0).instance() as RLGSelect

    select!.clear()
    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignTop()

    expect(one.rect()).toEqual({ x: 200, y: 200, width: 100, height: 200 })
    expect(two.rect()).toEqual({ x: 400, y: 200, width: 200, height: 100 })
  })
})
