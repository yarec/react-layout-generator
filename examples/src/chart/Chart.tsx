import * as React from 'react';

import Layout, { IPosition, IUnit, PositionRef } from '../../../src/components/Layout';
import Layouts from '../../../src/components/Layouts';
import Params from '../../../src/components/Params';
import { IEditHelperProps } from '../../../src/editors/EditHelper';
import { updateParamLocation, updateParamOffset } from '../../../src/editors/update';
import Generator, { IGenerator } from '../../../src/generators/Generator';
import RLGLayout, { EditOptions } from '../../../src/RLGLayout';
import RLGPanel, { IRLGPanelArgs } from '../../../src/RLGPanel';
import { DebugOptions, IPoint, ISize } from '../../../src/types';
import { t1 } from './tree';
import TreeMap from './TreeMap';

interface IChartState {
  node: string;
}

export default class Chart extends React.Component<IEditHelperProps, IChartState> {

  private _g: IGenerator
  private _params: Params = new Params({ name: 'chart' });
  private _treeMap: TreeMap;

  constructor(props: IEditHelperProps) {
    super(props)

    this._g = new Generator('chart', this.init.bind(this), this._params);

    this._treeMap = t1;
    this.state = {
      node: 'a'
    }
  }

  public render() {
    return (
      <RLGLayout
        name='example.Chart'
        edit={EditOptions.all}
        debug={DebugOptions.none}
        g={this._g}
      >
        <RLGPanel
          key={this.state.node}
          data-layout={{ name: this.state.node }}
          style={{ backgroundColor: 'hsl(200,100%,80%)' }}
        >
          {(args: IRLGPanelArgs) => (
            <div>
              <span >{this.state.node}</span>
            </div>
          )}
        </RLGPanel>
      </RLGLayout>
    )
  }

  public init = (g: IGenerator): Layouts => {
    const node = this._treeMap.lookup(this.state.node);
    const containersize = this._params.get('containersize') as ISize;
    const aLocation = this._params.get('aLocation') as IPoint;

    const layouts = g.layouts();

    if (this._params.changed()) {
      // update Layout for each update
      layouts.map.forEach((layout) => {
        layout.touch();
      });
    }

    if (node && containersize) {

      // console.log('aLocation', node, aLocation);

      // Self
      const self: IPosition = {
        units: { origin: { x: 50, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
        location: aLocation ? aLocation : { x: 10, y: 10 },
        size: { width: 150, height: 100 },
        editor: {
          edits: [
            { ref: PositionRef.position, variable: `${node.name}Location`, updateParam: updateParamLocation }
          ]
        },
      }
      // console.log('cardSize', cardSize);

      layouts.set(this.state.node, self, g);

      if (0 && node.children.length) {
        const spacing = containersize.width / node.children.length;
        const start = containersize.width / 2 - spacing * node.children.length / 2;

        node.children.forEach((name, i) => {
          const child: IPosition = {
            units: { origin: { x: 50, y: 50 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 0, y: 0 },
            size: { width: 150, height: 100 },
            editor: {
              edits: [
                { ref: PositionRef.position, variable: `${name}Offset`, updateParam: updateParamOffset }
              ]
            },
            align: {
              key: this.state.node,
              offset: { x: -start + i * spacing, y: 100 },
              source: { x: 50, y: 100 },
              self: { x: 50, y: 0 }
            }
          }
          layouts.set(name, child, g);
        });
      }
    }

    return layouts;
  }

  protected createElements() {

    // Display parent and children with connections

    return null;
  }

  protected renderConnection(layout: Layout) {
    const p = layout.connectionHandles();
    if (p.length) {
      return null;
    }
    return null;
  }
}