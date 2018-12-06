import * as React from 'react';

import { IUnit } from '../../../src/components/Layout'
import { IGenerator } from '../../../src/generators/Generator';
import ReactLayout from '../../../src/ReactLayout';

import FoundationStack from './FoundationStack';
import solitaireGenerator from './solitaireGenerator';
import Stock from './Stock';
import TableauStack from './TableauStack';
import Waste from './Waste';

/**
 * Names of layouts are based on position not on the card names.
 */

export interface ISolitaireProps {
  name?: string;
}

interface ISolitaireState {
  update: number;
}

export default class Solitaire extends React.Component<ISolitaireProps, ISolitaireState> {

  private _g: IGenerator = solitaireGenerator('example.solitaire');

  private _stock: Stock;
  private _waste: Waste;
  private _foundation: FoundationStack[] = [];
  private _tableau: TableauStack[] = [];

  constructor(props: ISolitaireProps) {
    super(props);

    this._stock = new Stock(this.update);
    this._waste = new Waste(this.update);
    for (let i = 0; i < 4; i++) {
      this._foundation.push(new FoundationStack(this.update));
    }
    for (let i = 0; i < 7; i++) {
      this._tableau.push(new TableauStack(this.update))
    }

    this.state = { update: 0 };

    this.newGame.bind(this);
  }

  public componentDidMount() {
    this.init();
  }

  public update = () => {
    this.setState({ update: this.state.update + 1 });
  }

  public init() {
    this._stock.shuffle();
    this._waste.clear();
    this._foundation.forEach((foundation) => { foundation.clear() });
    this._tableau.forEach((tableau) => { tableau.clear() });
    this._tableau.forEach((tableau, i) => { tableau.populate(this._stock, i) });
    this.setState({ update: this.state.update + 1 });
  }

  /**
   * Moves the top cards to the tableau after each shuffle.
   */
  public newGame = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.init();
  }

  /**
   * Moves the top (3) cards to the waste pushing any
   * existing cards to the stock when the stock is touched or clicked.
   */
  public onPopulateWaste = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this._stock && this._waste) {
      if (this._stock.length) {
        this._waste.populate(this._stock);
        this.setState({ update: this.state.update + 1 });
      }
    }
  }

  public render() {
    return (
      <ReactLayout
        name='example.Solitaire'
        edit={false}
        debug={false}
        g={this._g}
      >
        <div
          key='stock'
          data-layout={{
            name: 'stock'
          }}
          onClick={this.onPopulateWaste}
        >
          {this._stock.cards()}
        </div>

        <div
          key={'waste'}
          data-layout={{
            name: 'waste'
          }}
        >
          {this._waste.cards()}
        </div>

        {this.foundations()}

        {this.tableaus()}

        <button
          key={'New Game'}
          data-layout={{
            name: 'New Game',
            position: {
              units: { origin: { x: 50, y: 50 }, location: IUnit.percent, size: IUnit.pixel },
              location: { x: 50, y: 90 },
              size: { width: 90, height: 24 }
            }
          }}
          onClick={this.newGame}
        >
          New Game
        </button>

      </ReactLayout>
    );
  }

  protected foundations = () => {
    const jsx = [];
    for (let i = 0; i < 4; i++) {
      const name = `foundation${i + 1}`;
      jsx.push(
        <div
          key={name}
          data-layout={{
            name
          }}
        >
          {this._foundation[i].cards()}
        </div>
      );
    }
    return jsx;
  }

  protected tableaus = () => {
    const jsx = [];
    for (let i = 0; i < 7; i++) {
      const name = `tableau${i + 1}`;
      jsx.push(
        <div
          key={name}
          data-layout={{
            name
          }}
        >
          {this._tableau[i].cards()}
        </div>
      );
    }
    return jsx;
  }

  protected grid = () => {
    const jsx = [];

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
                size: { width: 1, height: 100 }
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

