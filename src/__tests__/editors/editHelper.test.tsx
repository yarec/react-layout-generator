import * as React from 'react'

import { EditHelper, IEditHelperProps, Status } from '../../editors/EditHelper'
import * as Enzyme from 'enzyme';
import { Params } from '../../components/Params';
import { IGenerator, ICreate, Generator } from '../../generators/Generator';
import { dynamicGenerator, ServiceOptions, RLGLayout } from '../../react-layout-generator';
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

const h = () => new EditHelper();

it('editHelper #1', () => {
  g.params().set('containersize', { width: 1000, height: 1000 });
  const wrapper = mount(
    <Intro editHelper={h} />
  )
  const rlgLayout = wrapper.find('RLGLayout').at(0).instance()

  // console.log('rlgLayout:', rlgLayout)

  const hello = wrapper.find("[id='hello']");
  // if (hello) {
  //   console.log('hello:', hello)
  // }

  expect(rlgLayout && hello).toBeTruthy();

})

interface IIntroState {
  update: number;
}

class Intro extends React.Component<IEditHelperProps, IIntroState> {

  private _g = dynamicGenerator('rlg.intro');
  private _edit: boolean = false;

  constructor(props: IEditHelperProps) {
    super(props);

    this.state = { update: 0 };

  }

  public componentDidMount() {
    // console.log('EditHelpers load Intro');
    this.props.editHelper().load([
      { name: 'edit', command: this.setEdit, status: this._edit ? Status.up : Status.down }
    ])
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this._edit = true
    } else {
      status = Status.down;
      this._edit = false
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 })

    return status;
  }

  public render() {
    return (
      <RLGLayout
        name={'RLGLayout.intro.example'}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        // debug={[DebugOptions.data, DebugOptions.mouseEvents, DebugOptions.error]}
        g={this._g}
        containersize={{ width: 1000, height: 1000 }}
      >
        <div data-layout={{
          name: 'hello',
          position: {
            location: { left: '10%', y: '10%', width: 150, height: '250u' }
          }
        }}
        >
          <p>A typescript library with a small runtime (~50K).</p>
        </div>

      </RLGLayout>
    );
  }
}