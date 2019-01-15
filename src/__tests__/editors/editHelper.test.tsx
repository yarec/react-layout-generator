import * as React from 'react'

import { EditHelper, IEditHelperProps, Status } from '../../editors/EditHelper'
import * as Enzyme from 'enzyme';
import { Params } from '../../components/Params';
import { IGenerator, ICreate, Generator } from '../../generators/Generator';
import { dynamicGenerator, EditOptions, RLGLayout, Unit } from '../../react-layout-generator';
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
  private _edit: EditOptions = EditOptions.none;

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
      this._edit = EditOptions.all
    } else {
      status = Status.down;
      this._edit = EditOptions.none
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
        edit={this._edit ? EditOptions.all : EditOptions.none}
        // debug={[DebugOptions.data, DebugOptions.mouseEvents, DebugOptions.error]}
        g={this._g}
      >
        <div data-layout={{
          name: 'hello',
          position: {
            location: { x: 10, y: 10, unit: Unit.percent},
            size: { width: 150, height: 250, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <p>A typescript library with a small runtime (~50K).</p>
        </div>

      </RLGLayout>
    );
  }
}