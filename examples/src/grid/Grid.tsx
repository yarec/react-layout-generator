import * as React from 'react';

import { IUnit } from '../../../src/components/Layout'
import { IGenerator } from '../../../src/generators/Generator';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';

export default class Grid extends React.Component {

  private _g: IGenerator = RLGDynamic('example.grid');
  private _g2: IGenerator = RLGDynamic('example.layout');

  public render() {
    return (
      <ReactLayout
        name='example.Grid'
        editLayout={false}
        g={this._g}
      >
        <div
          data-layout={{
            name: 'grid',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.preserve },
              location: { x: 5, y: 5 },
              size: { width: 75, height: 90 }
            }
          }}
        >
          <ReactLayout
            name='example.Grid'
            editLayout={false}
            g={this._g2}
          >
            {this.grid()}
          </ReactLayout>
        </div>
      </ReactLayout >
    );
  }

  protected grid = () => {
    const jsx = [];

    for (let j = 0; j < 100; j++) {
      if (j % 2 === 0) {
        const name = `gridH${j + 1}`;
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.preserve },
                location: { x: 0, y: j },
                size: { width: 100, height: .1 }
              }
            }}
            style={{ backgroundColor: 'hsl(210,100%,80%)' }}
          />
        );
      }
    }

    for (let i = 0; i < 100; i++) {
      if (i % 2 === 0) {
        const name = `gridV${i + 1}`;
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
                location: { x: i, y: 0 },
                size: { width: .1, height: 100 }
              }
            }}
            style={{ backgroundColor: 'hsl(210,100%,80%)' }}
          />
        );
      }
    }

    return jsx;
  }
}

