import * as React from 'react';
import styled from 'styled-components';

import { IUnit } from '../../../src/components/Layout';
import dynamicGenerator from '../../../src/generators/dynamicGenerator';
import { IGenerator } from '../../../src/generators/Generator';
import RLGLayout, { EditOptions } from '../../../src/RLGLayout';

import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
// import { DebugOptions } from '../../../src/types';

// const Title = styled.h2`
// `

const Description = styled.p`
  word-break: normal;
  white-space: normal;
  text-align: center;
`

interface IIntroState {
  update: number;
}

export default class Intro extends React.Component<IEditHelperProps, IIntroState> {

  private _g: IGenerator = dynamicGenerator('rlg.intro');
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
          name: 'introFeature1',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.unmanagedHeight },
            location: { x: 10, y: 10 },
            size: { width: 150, height: 250 }
          }
        }}
        >
          <Description>
            A typescript library with a small runtime (~50K).
          </Description>
        </div>

        <div data-layout={{
          name: 'introFeature2',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.unmanagedHeight },
            location: { x: 25, y: 30 },
            size: { width: 250, height: 350 }
          }
        }}
        >
          <Description>
            These examples are all laid out using only react-layout-generator.
          </Description>
        </div>

        <div data-layout={{
          name: 'introFeature3',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.unmanagedHeight },
            location: { x: 50, y: 10 },
            size: { width: 250, height: 350 }
          }
        }}
        >
          <Description>
            Ideal for laying out svg.
          </Description>
        </div>

        <div data-layout={{
          name: 'introFeature4',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.unmanagedHeight },
            location: { x: 50, y: 50 },
            size: { width: 250, height: 350 }
          }
        }}
        >
          <Description>
            Supports scaling css.
          </Description>
        </div>

      </RLGLayout>
    );
  }
}