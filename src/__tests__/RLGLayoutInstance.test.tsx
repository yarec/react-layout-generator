import * as React from 'react'
// import * as ReactDOM from 'react-dom'

import { Params } from '../components/Params'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { RLGLayout } from '../RLGLayout'
import { DebugOptions, ServiceOptions } from '../types'
// import ReactResizeDetector from 'react-resize-detector'

import * as Enzyme from 'enzyme';
// import { RLGSelect } from '../editors/RLGSelect';

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

  test('it should generate <div instance #1', () => {
    g.params().set('containersize', { width: 1000, height: 1000 });
    const wrapper = mount(
      <RLGLayout
        name='instance#3'
        service={ServiceOptions.edit}
        debug={DebugOptions.all}
        g={g}
        containersize={{ width: 1000, height: 500 }}
      >
        <div data-layout={{
          name: 'hello',
          position: {
            location: { left: 200, top: 50, width: 200, height: 200 }
          }
        }}
          style={{ backgroundColor: 'tan' }} >
          <span>hello</span>
        </div>
      </RLGLayout>
    )
    const rlgLayout = wrapper.find('RLGLayout').at(0).instance()

    // console.log('rlgLayout:', rlgLayout)

    const hello = wrapper.find("[id='hello']").at(0).instance();
    // if (hello) {
    //   console.log('hello:', hello)
    // }

    expect(rlgLayout && hello).toBeTruthy();
  });

})