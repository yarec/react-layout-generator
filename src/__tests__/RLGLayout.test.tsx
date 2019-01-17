import * as React from 'react'

import { Params } from '../components/Params'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { RLGLayout } from '../RLGLayout'
import { DebugOptions, EditOptions, Unit, OverflowOptions } from '../types'

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
    block = blocks.set(args.name, args.position, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

describe('RLGLayout', () => {
  test('it should allow props to be set #1', () => {
    const wrapper = mount(
      <RLGLayout name='test#1' debug={DebugOptions.info} g={g} overflowX={OverflowOptions.hidden}>
        <div data-layout={{
          name: 'a', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanaged }
          }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanagedHeight }
          }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanagedWidth }
          }
        }}>
          <span>A test</span>
        </div>
      </RLGLayout>
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.info);
  });

  test('it should allow props to be set #2', () => {
    const wrapper = mount(
      <RLGLayout name='test#1' debug={DebugOptions.mouseEvents} g={g} overflowY={OverflowOptions.hidden}>
        <div data-layout={{
          name: 'a', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanaged }
          }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanagedHeight }
          }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanagedWidth }
          }
        }}>
          <span>A test</span>
        </div>
      </RLGLayout>
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.mouseEvents);
  });

  test('it should allow props to be set #3', () => {
    const wrapper = mount(
      <RLGLayout name='test#1' debug={DebugOptions.all} g={g} overflowY={OverflowOptions.scroll}>
        <div data-layout={{
          name: 'a', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanaged }
          }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'b', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanagedHeight }
          }
        }}>
          <span>A test</span>
        </div>

        <div data-layout={{
          name: 'c', position: {
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100, unit: Unit.unmanagedWidth }
          }
        }}>
          <>
            <span>A test</span>
          </>
        </div>
      </RLGLayout>
    )
    expect(wrapper.props().debug).toEqual(DebugOptions.all);
  });

  test('it should allow props to be set #2', () => {
    const wrapper = mount(<RLGLayout name='test#2' edit={EditOptions.all} g={g} />)
    expect(wrapper.props().edit).toEqual(EditOptions.all);
  });
})