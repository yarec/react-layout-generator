import * as React from 'react'

import {
  DebugOptions,
  DragDrop,
  IEditHelperProps,
  IGenerator,
  RLGLayout,
  ServiceOptions,
  Unit
} from '../importRLG'

import { Control } from '../../../src/Control'
import FoundationStack from './FoundationStack'
import solitaireGenerator from './solitaireGenerator'
import Stock from './Stock'
import TableauStack from './TableauStack'
import Waste from './Waste'
// import {allowFoundationDrop} from './Stack'

/**
 * Names of blocks are based on position not on the card names.
 */

export interface ISolitaireProps extends IEditHelperProps {
  name?: string
}

interface ISolitaireState {
  update: number

}

export default class Solitaire extends React.Component<
  ISolitaireProps,
  ISolitaireState
> {
  private _g: IGenerator = solitaireGenerator({ name: 'example.solitaire' })

  private _stock: Stock
  private _waste: Waste
  private _foundation: FoundationStack[] = []
  private _tableau: TableauStack[] = []

  constructor(props: ISolitaireProps) {
    super(props)

    this._stock = new Stock(this.update, this._g)
    this._waste = new Waste(this.update, this._g)
    for (let i = 0; i < 4; i++) {
      this._foundation.push(new FoundationStack(this.update, this._g))
    }
    for (let i = 0; i < 7; i++) {
      this._tableau.push(new TableauStack(this.update, this._g))
    }

    this.state = { update: 0 }

    this.newGame.bind(this)
  }

  public componentDidMount() {
    this.init()
  }

  public update = () => {
    this.setState({ update: this.state.update + 1 })
  }

  public init() {
    this._stock.shuffle()
    this._waste.clear()
    this._foundation.forEach(foundation => {
      foundation.clear()
    })
    this._tableau.forEach(tableau => {
      tableau.clear()
    })
    this._tableau.forEach((tableau, i) => {
      tableau.populate(this._stock, i)
    })
    this.setState({ update: this.state.update + 1 })
  }

  /**
   * Moves the top cards to the tableau after each shuffle.
   */
  public newGame = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.init()
  }

  /**
   * Moves the top (3) cards to the waste pushing any
   * existing cards to the stock when the stock is touched or clicked.
   */
  public onPopulateWaste = (event: React.MouseEvent) => {
    if (this._stock && this._waste) {
      if (this._stock.length) {
        this._waste.populate(this._stock)
        this.setState({ update: this.state.update + 1 })
      }
    }
  }

  public noop = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    
  }



  public render() {
    return (
      <RLGLayout
        name='example.Solitaire'
        g={this._g}
        service={ServiceOptions.dnd}
        layers={{
          maximum: 3,
          service: 2 
        }}
        debug={[DebugOptions.info, DebugOptions.mouseEvents]}
      >
        <div
          key='stock'
          data-layout={{
            name: 'stock'
          }}
          data-layer={3}>
          onClick={this.onPopulateWaste}
        >
          {this._stock.cards()}
          <button onMouseDown={this.noop}>Test</button>
        </div>

        <div
          key={'waste'}
          data-layout={{
            name: 'waste'
          }}
          data-layer={1}
        >
          {this._waste.cards()}
        </div>

        {this.foundations()}

        {this.tableaus()}

        <Control name={'New Game'} data-layout={{
              name: 'New Game',
              position: {
                origin: { x: 50, y: 50 },
                location: { x: 50, y: 90, unit: Unit.percent },
                size: { width: 90, height: 24 },
                layer: 10000
              }
            }}
            data-layer={3}>
          <button
            key={'New Game'}
            onClick={this.newGame}
          >
            New Game
          </button>
        </Control>
      </RLGLayout>
    )
  }

  protected foundations = () => {
    const jsx = []

    for (let i = 0; i < 4; i++) {
      const name = `foundation${i + 1}`
      jsx.push(
        <DragDrop
          name={name}
          key={name}
          canDrop={this._foundation[i].canDrop}
          drop={this._foundation[i].drop}
          endDrop={this._foundation[i].endDrop}
          data-layout={{
            name
          }}
          data-layer={2}
          g={this._g}
        >
          {this._foundation[i].cards()}
        </DragDrop>
      )
    }
    return jsx
  }

  protected tableaus = () => {
    const jsx = []

    for (let i = 0; i < 7; i++) {
      const name = `tableau${i + 1}`
      jsx.push(
        <div
          key={name}
          data-layout={{
            name
          }}
          data-layer={2}
        >
          {this._tableau[i].cards()}
        </div>
      )
    }
    return jsx
  }

  protected grid = () => {
    const jsx = []

    for (let i = 0; i < 100; i++) {
      if (i % 2 === 0) {
        const name = `gridV${i + 1}`
        jsx.push(
          <div
            key={name}
            data-layout={{
              name,
              position: {
                location: { x: i, y: 0, unit: Unit.percent },
                size: { width: 1, height: 100, unit: Unit.percent }
              }
            }}
            style={{ backgroundColor: 'hsl(210,100%,80%)' }}
          />
        )
      }
    }

    return jsx
  }
}
