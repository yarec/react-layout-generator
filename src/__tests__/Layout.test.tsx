import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import { Params } from '../components/Params'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { Layout } from '../Layout'
import { DebugOptions, ServiceOptions, Unit, OverflowOptions } from '../types'

import * as Enzyme from 'enzyme';

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
        name='test#1'
        debug={DebugOptions.info}
        g={g}
        overflowX={OverflowOptions.hidden}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'a', 
          location: { left: 0, top: 0, width: 100, height: 100, unit: Unit.unmanaged }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b',
          location: { left: 0, top: 0, width: 100, height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c', 
          location: { left: 0, top: 0, width: '100u', height: 100 }
        }}>
          <span>A test</span>
        </div>
      </Layout>
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.info);
  });

  test('it should allow props to be set #2', () => {
    const wrapper = mount(
      <Layout
        name='test#2'
        debug={DebugOptions.mouseEvents}
        g={g}
        overflowY={OverflowOptions.hidden}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'a',
          location: { left: 0, top: 0, width: '100u', height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b',
          location: { left: 0, top: 0, width: 100, height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c',
          location: { left: 0, top: 0, width: '100u', height: 100 }
        }}>
          <span>A test</span>
        </div>
      </Layout>
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.mouseEvents);
  });

  test('it should allow props to be set #3', () => {
    const wrapper = mount(
      <Layout
        name='test#3'
        debug={DebugOptions.all}
        g={g}
        overflowY={OverflowOptions.scroll}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'a', 
          location: { left: 0, top: 0,  width: '100u', height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b', 
          location: { left: 0, top: 0, width: 100, height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c',
          location: { left: 0, top: 0, width: '100u', height: 100 }
        }}>
          <>
            <span>A test</span>
          </>
        </div>
      </Layout>
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.all);
  });

  test('it should allow props to be set #4', () => {
    const wrapper = mount(
      <Layout
        name='test#4'
        debug={[DebugOptions.all]}
        g={g}
        params={[['key', 0]]}
        overflowY={OverflowOptions.auto}
        containersize={{ width: 1000, height: 500 }}
      >
        <div data-layout={{
          name: 'a',
          location: { left: 0, top: 0, width: '100u', height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b', 
          location: { left: 0, top: 0, width: 100, height: '100u' }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c',
          location: { left: 0, top: 0, width: '100u', height: 100 }
        }}>
          <>
            <span>A test</span>
          </>
        </div>
      </Layout>
    )
    expect(wrapper.props().debug).toEqual([DebugOptions.all]);
  });


  test('it should allow props to be set #2', () => {
    const wrapper = mount(<Layout
      name='test#3'
      service={ServiceOptions.edit}
      g={g}
      containersize={{ width: 1000, height: 1000 }}
    />)
    expect(wrapper.props().service).toEqual(ServiceOptions.edit);
  });

  test('methods #1', () => {
    const layout = new Layout({ name: 'methods #1', service: ServiceOptions.edit, g })

    expect(layout.select).toEqual(undefined)
    expect(layout.getBoundingLeftTop()).toEqual({ x: 0, y: 0 })
  });

  test('methods #2', () => {
    const wrapper = mount(<Layout
      name='test#5'
      service={ServiceOptions.edit}
      debug={DebugOptions.all}
      g={g}
      containersize={{ width: 1000, height: 500 }}
    >
      <div data-layout={{
        name: 'shuffle',
        location: { left: '80%', top: '80%', width: 100, height: 24 }
      }}>
        <span>Hello</span>
      </div>
    </Layout>)
    const element: Layout = wrapper.instance() as Layout
    if (element.root) {
      expect(element.getBoundingLeftTop()).toEqual({ x: 0, y: 0 })
      ReactTestUtils.Simulate.mouseDown(element.root, { button: 2 });
      ReactTestUtils.Simulate.mouseDown(element.root);
      ReactTestUtils.Simulate.mouseUp(element.root);
      ReactTestUtils.Simulate.contextMenu(element.root);
    }
    expect(wrapper.props().service).toEqual(ServiceOptions.edit);
  })

  test('methods #3', () => {
    const wrapper = mount(<Layout
      name='test#5'
      service={ServiceOptions.edit}
      debug={DebugOptions.all}
      g={g}
      containersize={{ width: 1000, height: 500 }}
    >
      <div data-layout={{
        name: 'shuffle',
        location: { left: '80%', top: '80%', width: 100, height: 24 }
      }}>
        <span>Hello</span>
      </div>
    </Layout>)
    const element: Layout = wrapper.instance() as Layout
    if (element.select) {
      // element.select.

    }
    expect(wrapper.props().service).toEqual(ServiceOptions.edit);
  })
})