import * as React from 'react';
import styled from 'styled-components';

import { IUnit } from '../../../src/components/Layout';
import { IGenerator } from '../../../src/generators/Generator';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';

// const Title = styled.h2`
// `

const Description = styled.p`
  word-break: normal;
  white-space: normal;
`

export default class Intro extends React.Component {
  private _g: IGenerator = RLGDynamic('rlg.intro');

  public render() {
    return (
      <ReactLayout
        name={'reactLayout.intro.example'}
        editLayout={true}
        g={this._g}
      >
        <div data-layout={{
          name: 'introFeature1',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
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
          name: 'introFeature',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 30, y: 30 },
            size: { width: 250, height: 350 }
          }
        }}
        >
          <Description>
            This demo and all components are built is with react-layout-generator and styled-components.
          </Description>
        </div>

      </ReactLayout>
    );
  }
}