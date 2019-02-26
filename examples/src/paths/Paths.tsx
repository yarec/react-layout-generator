import * as React from 'react'

import {
  Block,
  Blocks,
  DebugOptions,
  Generator,
  ICreate,
  IEditHelperProps,
  IGenerator,
  Layout,
  Params,
  pathHook,
  ServiceOptions
} from '../importRLG'

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
  private _output: Block[] = []

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
    const blocks = this._g.blocks()

    hooks.set(
      'Paths #1',
      pathHook({
        prefix: 'Paths #1',
        points: [
          {x: 0, y: 0}, {x: '100%',y: '100%'},
          {x: 0, y: '100%'}, {x: '100%',y: 0},
          {x: 0, y: '50%'}, {x: '50%',y: 0},
        ],
        input: () => blocks.layers(3),
        output: this._output,
        velocity: .1,
        anchor: { x: 0.1, y: 0 },
        placement: { x: 0, y: 0 },
        infinite: true,
        spacing: 200,
        g: this._g
      })
    )
  }

  public render() {
    return (
      <Layout
        name="example.Paths"
        service={ServiceOptions.edit}
        debug={DebugOptions.none}
        g={this._g}
        animate={{ active: true }}
        layers={{encapsulate: true}}
      >
        <div
          data-layout={{
            name: 'animation3.1',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #1</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.2',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #2</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.3',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #3</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.4',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #4</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.5',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #5</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.6',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #6</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.7',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #7</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.8',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #8</span>
        </div>


        <div
          data-layout={{
            name: 'animation3.9',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #9</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.10',

            origin: { x: .50, y: .50 },
            location: { left: -1000, top: -1000, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #10</span>
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
