import * as React from 'react';

import {
  Block,
  Blocks, 
  DebugOptions,
  Generator,
  IEditHelperProps,
  IGenerator,
  IPosition,
  IRLGMetaDataArgs,
  ISize,
  Params,
  PositionRef,
  RLGLayout, 
  RLGPanel, 
  ServiceOptions,
  updateParamLocation,
  updateParamOffset,
  IInputRect
} from '../importRLG'

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
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={this._g}
      >
        <RLGPanel
          key={this.state.node}
          data-layout={{ name: this.state.node }}
          style={{ backgroundColor: 'hsl(200,100%,80%)' }}
        >
          {(args: IRLGMetaDataArgs) => (
            <div>
              <span >{this.state.node}</span>
            </div>
          )}
        </RLGPanel>
      </RLGLayout>
    )
  }

  public init = (g: IGenerator): Blocks => {
    const node = this._treeMap.lookup(this.state.node);
    const containersize = this._params.get('containersize') as ISize;
    const aLocation = this._params.get('aLocation') as IInputRect;

    const blocks = g.blocks();

    if (this._params.changed()) {
      // update Layout for each update
      blocks.map.forEach((block) => {
        block.touch();
      });
    }

    if (node && containersize) {

      // console.log('aLocation', node, aLocation);

      // Self
      const self: IPosition = {
        origin: { x: 50, y: 0 }, 
        location: aLocation ? aLocation : { left: '10%', top: '10%', width: 150, height: 100 },
        
        transform: [{rotate: 10, origin: {x: 50, y: 50}}],
        editor: {
          edits: [
            { ref: PositionRef.position, variable: `${node.name}Location`, updateParam: updateParamLocation }
          ]
        },
      }
      // console.log('cardSize', cardSize);

      blocks.set(this.state.node, self, g);

      if (0 && node.children.length) {
        const spacing = containersize.width / node.children.length;
        const start = containersize.width / 2 - spacing * node.children.length / 2;

        node.children.forEach((name, i) => {
          const child: IPosition = {
            origin: { x: 50, y: 50 }, 
            location: { left: 0, top: 0, width: 150, height: 100 },
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
          blocks.set(name, child, g);
        });
      }
    }

    return blocks;
  }

  protected createElements() {

    // Display parent and children with connections

    return null;
  }

  protected renderConnection(block: Block) {
    const p = block.connectionHandles();
    if (p.length) {
      return null;
    }
    return null;
  }
}