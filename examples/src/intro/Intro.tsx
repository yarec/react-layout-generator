import * as React from 'react';
import styled from 'styled-components';

import { DebugOptions, OverflowOptions } from '../../../src/types';
import {
  EditOptions,
  IEditHelperProps,
  RLGLayout,
  rollGenerator,
  Status,
  Unit
} from '../importRLG'

// const Title = styled.h2`
// `

const Description = styled.div`
  word-break: normal;
  white-space: normal;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.25rem;
`

interface IIntroState {
  update: number;
}

export default class Intro extends React.Component<IEditHelperProps, IIntroState> {

  private _g = rollGenerator('rlg.intro');
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
        debug={DebugOptions.data}
        params={[
          ['velocity', .1] // 100px per second
        ]}
        animate={{ active: true }}
        g={this._g}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >
        {this.content()}
      </RLGLayout>
    );
  }

  public content = () => {

    let index = 1000
    const features: any[] = [
      <div key={`${++index}`}>Template Support.</div>,
      <div key={`${++index}`}>Dashboard</div>,
      <div key={`${++index}`}>Examples built with RLG</div>,
      <div key={`${++index}`}>Animation Support</div>,
      <div key={`${++index}`}>Typescript</div>,
      <div key={`${++index}`}>Core Editor Support</div>,
      <div key={`${++index}`}>Design and Runtime</div>,
      <div key={`${++index}`}>Serialization Support</div>,
      <div key={`${++index}`}>Animation Roll Generator</div>,
      <div key={`${++index}`}>Responsive Desktop Generator</div>,
      <div key={`${++index}`}>HTML and SVG</div>,
      <div key={`${++index}`}>Games</div>,
      <div key={`${++index}`}>Sample Solitaire Game</div>,
      <div key={`${++index}`}>Text Editing</div>,
      <div key={`${++index}`}>Ideal for SVG</div>,
      <div key={`${++index}`}>Games</div>,
      <div key={`${++index}`}>Columns Generator</div>,
      <div key={`${++index}`}>Position and Size Editing</div>,
      <div key={`${++index}`}>Layout in React</div>,
      <div key={`${++index}`}>Diagrams</div>,
      <div key={`${++index}`}>Fine Grain Responsive</div>,
      <div key={`${++index}`}>Fit Text to Container</div>,
      <div key={`${++index}`}>Animation: You're looking at one now</div>,
      <div key={`${++index}`}>Rows Generator</div>,
      <div key={`${++index}`}>Sample Editor</div>,
      <div key={`${++index}`}>Dynamic Generator</div>,
      <div key={`${++index}`}>Layer Support with Editing</div>,
      <div key={`${++index}`}>Bring Forward, Send to Back, ...</div>,
      <div key={`${++index}`}>Context Menu</div>,
      <div key={`${++index}`}>ToolBar in Editor</div>,
      <div key={`${++index}`}>Align Left, Top, Center, ... </div>,
      <div key={`${++index}`}>Linked Elements</div>,
      <div key={`${++index}`}>Persistance Options</div>,
      <div key={`${++index}`}>Custom Animation Behavior</div>,
      <div key={`${++index}`}>Physics Engine Capable</div>,
      <div key={`${++index}`}>Debug Options</div>,
      <div key={`${++index}`}>Overlay Support</div>,
    ]
    const jsx = []
    let i = 0
    let j = 0
    while (i < features.length) {
      const name = `${i++}`
      let col = 25
      if (j === 1) {col = 75}
      if (j === 2) {col = 50}
      jsx.push(
        <div
          key={name}
          
          data-layout={{
            name,
            position: {
              origin: {x: 50, y: 50},
              location: { x: col, y: i * 15, unit: Unit.percent },
              size: { width: 250, height: 100, unit: Unit.unmanagedHeight }
            }
          }}
        >
          <Description>
            {features[i]}
          </Description>
        </div>
      )
      j += 1
      if (j > 2) {j = 0}
    }

    return jsx
  }
}