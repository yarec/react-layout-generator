import * as React from 'react'
import * as Enzyme from 'enzyme';

import { Layout } from '../../Layout';
import { DebugOptions, ServiceOptions } from '../../types';
import { dynamicGenerator, Block } from '../../react-layout-generator';
import { Select } from '../../editors/Select';

const { mount } = Enzyme

const g = dynamicGenerator('example.CardDeck');

describe('Select', () => {
  test('Select #1', () => {
    g.clear()
    const wrapper = mount(
      <Layout
        name='Select#1'
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          location: { left: 200, top: 50 ,width: 200, height: 200 }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          location: { left: 400, top: 50 ,width: 200, height: 200 }
        }}>
          <span>two</span>
        </div>
      </Layout>
    )

    // const layout = wrapper.instance() as Layout

    const select = wrapper.find(Select).at(0).instance() as Select

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    const z1 = one.zIndex
    const z2 = two.zIndex

    select!.sendBack()

    expect(one.zIndex).toEqual(Math.max(0, Math.min(z1, z2) - 1))
    expect(two.zIndex).toEqual(Math.max(0, Math.min(z1, z2) - 1))
  })
  test('Select #2', () => {
    g.clear()
    const wrapper = mount(
      <Layout
        name='Select#1'
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          location: { left: 200, top: 50, width: 200, height: 200 }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          location: { left: 400, top: 50, width: 200, height: 200 }
        }}>
          <span>two</span>
        </div>
      </Layout>
    )

    // const layout = wrapper.instance() as Layout

    const select = wrapper.find(Select).at(0).instance() as Select

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    const z1 = one.zIndex
    const z2 = two.zIndex

    select!.bringFront()

    expect(one.zIndex).toEqual(Math.max(z1, z2) + 1)
    expect(two.zIndex).toEqual(Math.max(z1, z2) + 1)
  })
  test('Select #3', () => {
    g.clear()
    const wrapper = mount(
      <Layout
        name='Select#1'
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          location: { left: 200, top: 200, width: 200, height: 200 }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          location: { left: 400, top: 250, width: 200, height: 100 }
        }}>
          <span>two</span>
        </div>
      </Layout>
    )

    // const layout = wrapper.instance() as Layout

    const select = wrapper.find(Select).at(0).instance() as Select

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignBottom()

    expect(one.rect).toEqual({ x: 200, y: 200, width: 200, height: 200 })
    expect(two.rect).toEqual({ x: 400, y: 300, width: 200, height: 100 })
  })
  test('Select #4', () => {
    g.clear()
    const wrapper = mount(
      <Layout
        name='Select#1'
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          location: { left: 200, top: 200, width: 100, height: 200 }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          location: { left: 400, top: 250, width: 200, height: 100 }
        }}>
          <span>two</span>
        </div>
      </Layout>
    )

    // const layout = wrapper.instance() as Layout

    const select = wrapper.find(Select).at(0).instance() as Select

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignCenter()

    expect(one.rect).toEqual({ x: 200, y: 200, width: 100, height: 200 })
    expect(two.rect).toEqual({ x: 150, y: 250, width: 200, height: 100 })
  })
  test('Select #5', () => {
    g.clear()
    const wrapper = mount(
      <Layout
        name='Select#1'
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}>
        <div data-layout={{
          name: 'one',
          location: { left: 200, top: 200, width: 100, height: 200 }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          location: { left: 400, top: 250, width: 200, height: 100 }
        }}>
          <span>two</span>
        </div>
      </Layout>
    )

    // const layout = wrapper.instance() as Layout

    const select = wrapper.find(Select).at(0).instance() as Select

    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignLeft()

    expect(one.rect).toEqual({ x: 200, y: 200, width: 100, height: 200 })
    expect(two.rect).toEqual({ x: 200, y: 250, width: 200, height: 100 })
  })
  test('Select #6', () => {
    g.clear()
    const wrapper = mount(
      <Layout
        name='Select#1'
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={g}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'one',
          location: { left: 200, top: 200, width: 100, height: 200 }
        }}>
          <span>one</span>
        </div>
        <div data-layout={{
          name: 'two',
          location: { left: 400, top: 250, width: 200, height: 100 }
        }}>
          <span>two</span>
        </div>
      </Layout>
    )

    // const layout = wrapper.instance() as Layout

    const select = wrapper.find(Select).at(0).instance() as Select

    select!.clear()
    const one = select!.select('one') as Block
    const two = select!.select('two') as Block

    select!.alignTop()

    expect(one.rect).toEqual({ x: 200, y: 200, width: 100, height: 200 })
    expect(two.rect).toEqual({ x: 400, y: 200, width: 200, height: 100 })
  })
})
