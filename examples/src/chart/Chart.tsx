import * as React from 'react'

import {
  Block,
  Blocks,
  DebugOptions,
  Generator,
  ICreate,
  IEditHelperProps,
  IGenerator,
  IMetaDataArgs,
  Layout,
  Panel,
  Params,
  PositionRef,
  ServiceOptions,
  updateParamLocation,
  vectorHook,
  ParamValue
} from '../importRLG'

import * as data from '../assets/data/params.json'

// import { t1 } from './tree'
// import TreeMap from './TreeMap'

interface IChartState {
  node: string
}

export default class Chart extends React.Component<
  IEditHelperProps,
  IChartState
> {
  private _g: IGenerator
  private _params: Params = new Params({ name: 'chart' })
  // protected _treeMap: TreeMap

  constructor(props: IEditHelperProps) {
    super(props)

    this._g = new Generator('chart', this.init.bind(this), this._params, this.create.bind(this))

    // this._treeMap = t1
    this.state = {
      node: 'a'
    }
  }

  public componentDidMount() {
    const hooks = this._g.hooks()
    
    hooks.set(
      'layer3',
      vectorHook({
        prefix: 'layer3',
        points: [{x: 0, y: 0}, {x: '100%',y: '100%'}],
        layer: 3,
        velocity: { x: 0.1, y: 0.05 },
        handle: { x: 0.1, y: 0 },
        placement: { x: 0, y: 0 },
        spacing: 200,
        g: this._g
      })
    )
  }

  public render() {
    return (
      <Layout
        name="example.Chart"
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={this._g}
        params={[
          ...(data['rlg.intro'] as Array<[string, ParamValue]>),
          ['velocity', { x: 0.01, y: -0.05 }]
        ]}
        animate={{ active: true }}
        layers={{encapsulate: true}}
      >
        <Panel
          key={this.state.node}
          data-layout={{
            name: this.state.node,
            origin: { x: .50, y: 0 }, 
            location:  { left: '50%', top: '50%', width: 150, height: 100 },
            
            transform: [{rotate: 10, origin: {x: .50, y: .50}}],
            editor: {
              edits: [
                { ref: PositionRef.position, variable: `${this.state.node}Location`, updateParam: updateParamLocation }
              ]
            },
          }}
          style={{ backgroundColor: 'hsl(200,100%,80%)' }}
        >
          {(args: IMetaDataArgs) => (
            <div>
              <span>{this.state.node}</span>
            </div>
          )}
        </Panel>

        <div
          data-layout={{
            name: 'animation3.1',

            // origin: { x: .50, y: .50 },
            location: { left: 0, top: 0, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #1</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.2',

            
            location: { left: 0, top: 0, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #2</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.3',

            // origin: { x: .50, y: .50 },
            location: { left: 0, top: 0, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #3</span>
        </div>
      </Layout>
    )
  }

  public init = (g: IGenerator): Blocks => {
    // const node = this._treeMap.lookup(this.state.node)
    // const containersize = this._params.get('containersize') as ISize
    // const aLocation = this._params.get('aLocation') as IPoint

    const blocks = g.blocks()

    if (this._params.changed()) {
      // update Layout for each update
      blocks.map.forEach(block => {
        block.touch()
      })
    }

    return blocks
  }

  protected create(args: ICreate): Block {

    if (!args.dataLayout) {
      console.error(`TODO default position ${args.name}`);
    }

    const block = args.g.blocks().set(args.name, args.dataLayout, args.g);

    return block;
  }

  protected createElements() {
    // Display parent and children with connections

    return null
  }

  protected renderConnection(block: Block) {
    const p = block.connectionHandles()
    if (p.length) {
      return null
    }
    return null
  }
}
