import * as React from 'react';
import styled from 'styled-components';

import { OverflowOptions } from '../../../src/types';
import {
  contentSlideGenerator,
  EditOptions,
  IEditHelperProps,
  RLGLayout,
  Status,
  Unit
} from '../importRLG'

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

  private _g = contentSlideGenerator('rlg.intro');
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
        params={[
          ['velocity', .1] // 100px per second
        ]}
        animate={{ active: true, throttleTime: 10 }} // 100 ms
        g={this._g}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >
        <div data-layout={{
          name: 'feature1',
          position: {
            location: { x: 10, y: 10, unit: Unit.percent },
            size: { width: 150, height: 250, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <Description>
            Layout in React.
          </Description>
        </div>

        <div data-layout={{
          name: 'feature2',
          position: {
            location: { x: 25, y: 30, unit: Unit.percent },
            size: { width: 250, height: 350, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <Description>
            These examples only use react-layout-generator.
          </Description>
        </div>

        <div data-layout={{
          name: 'feature3',
          position: {
            location: { x: 50, y: 10, unit: Unit.percent },
            size: { width: 250, height: 350, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <Description>
            Ideal for laying out svg.
          </Description>
        </div>

        <div data-layout={{
          name: 'feature4',
          position: {
            location: { x: 50, y: 50, unit: Unit.percent },
            size: { width: 250, height: 350, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <Description>
            Animation support.
          </Description>
        </div>

        <div data-layout={{
          name: 'feature5',
          position: {
            location: { x: 10, y: 50, unit: Unit.percent },
            size: { width: 250, height: 350, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <Description>
            Template support.
          </Description>
        </div>

        <div data-layout={{
          name: 'feature6',
          position: {
            location: { x: 10, y: 70, unit: Unit.percent },
            size: { width: 250, height: 350, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <Description>
            Template support.
          </Description>
        </div>

        {this.test()}

      </RLGLayout>
    );
  }

  public test = () => {
    const jsx = []
    for (let i = 0; i < 100; i++) {
      const name = `test${i}`
      jsx.push(
        <div
          key={name}
          data-layout={{
            name,
            position: {
              location: { x: 10, y: 100 + i*15, unit: Unit.percent },
              size: { width: 100, height: 100, unit: Unit.unmanagedHeight }
            }
          }}
        >
          <Description>
            {name}
        </Description>
        </div>
      )
    }
    return jsx
  }
}