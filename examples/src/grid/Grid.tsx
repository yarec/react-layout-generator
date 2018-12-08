import * as React from 'react';

import styled from 'styled-components';

import { IUnit } from '../../../src/components/Layout'
import { IGenerator } from '../../../src/generators/Generator';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';
import RLGPanel, { IRLPanelArgs } from '../../../src/RLGPanel';
import { ISize } from '../../../src/types';

export interface IProps {
  viewport: ISize;
}

const CalloutBottom = styled.div<IProps>`
  position: absolute;
  color: #000;
  width: ${(p) => p.viewport.width};
  height: ${(p) => p.viewport.height};
  background: #f3961c;
  border-radius: 10px;
  background: linear-gradient(top, #f9d835, #f3961c);

  /* creates triangle */
  &:after {
    content: "";
    display: block; /* reduce the damage in FF3.0 */
    position: absolute;
    bottom: -19.9px;
    left: 70px;
    width: 0;
    border-width: 20px 20px 0;
    border-style: solid;
    border-color: #f3961c transparent;
  }
`

export { CalloutBottom }

export default class Grid extends React.Component<{}, { unit: IUnit }> {

  private _g: IGenerator = RLGDynamic('example.grid');

  constructor(props: {}) {
    super(props);
    this.state = { unit: IUnit.pixel }
  }

  public setPixel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ unit: IUnit.pixel })
    this._g.clear();
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
        g={this._g}
      >
        <RLGPanel
          data-layout={{
            name: 'grid',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
              location: { x: 0, y: 0 },
              size: { width: 100, height: 100 }
            }
          }}
          style={{ overflow: 'hidden' }}
        >
          {(args: IRLPanelArgs) => (
            <ReactLayout
              name='example.Background'
              g={this._g}
            >
              {this.grid(this.state.unit, args.viewport)}
            </ReactLayout>
          )}
        </RLGPanel>

        <div
          data-layout={{
            name: 'square(percent, preserve)',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.preserve },
              location: { x: 20, y: 10 },
              size: { width: 20, height: 20 }
            }
          }}

          style={{ backgroundColor: 'red' }}
        >
          <span>Square (percent, preserve) </span> <br />
          <span>location (20%, 30%) in percent</span> <br />
          <span>size (20%, 20%) in preserve</span>
        </div>

        <div
          data-layout={{
            name: 'square(preserve)',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.preserve },
              location: { x: 30, y: 30 },
              size: { width: 20, height: 20 }
            }
          }}

          style={{ backgroundColor: 'red' }}
        >
          <span>Square (preserve) </span> <br />
          <span>location (20%, 50%) </span> <br />
          <span>size (20%, 20%) </span>
        </div>

        <div
          data-layout={{
            name: 'square(percent)',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
              location: { x: 50, y: 50 },
              size: { width: 20, height: 20 }
            }
          }}

          style={{ backgroundColor: 'red' }}
        >
          <span>Square (percent) </span> <br />
          <span>location (40%, 30%) </span> <br />
          <span>size (20%, 20%) </span>
        </div>

        <div
          data-layout={{
            name: 'callout',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.unmanaged },
              location: { x: 40, y: 40 },
              size: { width: 0, height: 0 },
              align: {
                key: 'square(percent)',
                offset: { x: 20, y: 0 },
                source: { x: 100, y: 0 },
                self: { x: 0, y: 50 }
              }
            }
          }}

          style={{ backgroundColor: '' }}
        >
          <span>Hello</span> <br />
          <span>World</span>
        </div>


      </ReactLayout>
    );
  }

  protected controls = () => (
    <div>
      <button
        key={'Pixel'}
        data-layout={{
          name: 'Pixel',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.pixel },
            location: { x: 10, y: 10 },
            size: { width: 90, height: 24 }
          }
        }}
        onClick={this.setPixel}
      >
        Pixel
  </button>
      <button
        key={'Percent'}
        data-layout={{
          name: 'Percent',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.preserve, size: IUnit.pixel },
            location: { x: 10, y: 20 },
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
            location: { x: 10, y: 30 },
            size: { width: 90, height: 24 }
          }
        }}
        onClick={this.setPreserve}
      >
        Preserve
  </button>
    </div>
  )

  protected grid = (unit: IUnit, viewport: ISize) => {
    const jsx = [];

    let countH = 100;
    let countV = 100;

    let minor = 2;
    let major = 10;

    let lineWidth = .1;

    // setup axis divisions
    switch (unit) {
      case IUnit.pixel: {
        minor = 10;
        major = 100;
        countH = Math.round(viewport.width);
        countV = Math.round(viewport.height);
        lineWidth = 1;
        break;
      }
      case IUnit.percent:
      case IUnit.preserve: {
        if (viewport.height < viewport.width) {
          const square = viewport.height / 100;
          countH = Math.round(viewport.width / square);
          countV = 100;
        } else {
          const square = viewport.width / 100;
          countH = 100;
          countV = Math.round(viewport.height / square);
        }
        break;
      }
      case IUnit.preserveHeight: {
        const square = viewport.height / 100;
        countH = Math.round(viewport.width / square);
        countV = 100;
        break;
      }
      case IUnit.preserveWidth: {
        const square = viewport.width / 100;
        countH = 100;
        countV = Math.round(viewport.height / square);
        break;
      }
    }

    for (let j = 0; j < countV; j++) {
      if (j % minor === 0) {
        const name = `gridH${j + 1}`;
        const background = (j % major === 0) ? 'hsl(210,100%,50%)' : 'hsl(210,100%,80%)';
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: unit, size: unit },
                location: { x: 0, y: j },
                size: { width: countH - 1, height: lineWidth }
              }
            }}
            style={{ backgroundColor: background }}
          />
        );
      }
    }

    for (let i = 0; i < countH; i++) {

      if (i % minor === 0) {
        const name = `gridV${i + 1}`;
        const background = (i % major === 0) ? 'hsl(210,100%,50%)' : 'hsl(210,100%,80%)';
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: unit, size: unit },
                location: { x: i, y: 0 },
                size: { width: lineWidth, height: countV - 1 }
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

