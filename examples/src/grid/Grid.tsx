import * as React from 'react';

// import Highlight from 'react-highlight';

import { IUnit } from '../../../src/components/Layout'
import { IGenerator } from '../../../src/generators/Generator';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';

export default class Grid extends React.Component<{}, { unit: IUnit }> {

  private _g: IGenerator = RLGDynamic('example.grid');

  constructor(props: {}) {
    super(props);
    this.state = { unit: IUnit.preserve }
  }

  public setPercent = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ unit: IUnit.percent })
    this._g.clear();
  }

  public setPreserve = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ unit: IUnit.preserve })
    this._g.clear();
  }

  public render() {
    return (
      <ReactLayout
        name='example.Grid'
        edit={false}
        g={this._g}
      >
        {this.grid(this.state.unit)}

        <button
          key={'Percent'}
          data-layout={{
            name: 'Percent',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.pixel },
              location: { x: 10, y: 10 },
              size: { width: 90, height: 24 }
            }
          }}
          onClick={this.setPercent}
        >
          Percent
        </button>
        <button
          key={'Preserve'}
          data-layout={{
            name: 'Preserve',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.pixel },
              location: { x: 10, y: 20 },
              size: { width: 90, height: 24 }
            }
          }}
          onClick={this.setPreserve}
        >
          Preserve
        </button>

        
      </ReactLayout>
    );
  }

  protected grid = (unit: IUnit) => {
    const jsx = [];

    for (let j = 0; j < 100; j++) {
      if (j % 2 === 0) {
        const name = `gridH${j + 1}`;
        const background = (j % 10 === 0) ? 'hsl(210,100%,50%)' : 'hsl(210,100%,80%)';
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: unit, size: unit },
                location: { x: 0, y: j },
                size: { width: 100, height: .1 }
              }
            }}
            style={{ backgroundColor: background }}
          />
        );
      }
    }

    for (let i = 0; i < 100; i++) {

      if (i % 2 === 0) {
        const name = `gridV${i + 1}`;
        const background = (i % 10 === 0) ? 'hsl(210,100%,50%)' : 'hsl(210,100%,80%)';
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: unit, size: unit },
                location: { x: i, y: 0 },
                size: { width: .1, height: 100 }
              }
            }}
            style={{ backgroundColor: background }}
          />
        );
      }
    }

    return jsx;
  }
}

