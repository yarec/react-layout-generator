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

export default class Solitaire extends React.Component<ISolitaireProps> {

  private _g: IGenerator = solitaireGenerator('example.solitaire');

  private _stock: Stock;
  private _waste: Waste;
  private _foundation: FoundationStack[];
  private _tableau: TableauStack[];

  constructor(props: ISolitaireProps) {
    super(props);

    this.newGame.bind(this);
  }

  /**
   * Moves the top cards to the tableau after each shuffle.
   */
  public newGame = (event: React.MouseEvent<HTMLButtonElement>) => {
    this._stock.shuffle();
    this._waste.clear();
    this._foundation.forEach((foundation) => { foundation.clear() });
    this._tableau.forEach((tableau) => { tableau.clear() });
    this._tableau.forEach((tableau, i) => { tableau.populate(this._stock, i) });
  }

  /**
   * Moves the top (3) cards to the waste pushing any
   * existing cards to the stock when the stock is touched or clicked.
   */
  public populateWaste = () => {
    if (this._stock && this._waste) {
      this._waste.populate(this._stock);
    }
  }

  public render() {
    return (
      <ReactLayout
        name='example.Solitaire'
        editLayout={false}
        g={this._g}
      >
        <div
          data-layout={{
            name: 'stock'
          }}
        >
          {this._stock.cards()}
        </div>

        <div
          data-layout={{
            name: 'waste'
          }}
        >
          {this._waste.cards()}
        </div>

        <div
          data-layout={{
            name: 'foundation1'
          }}
        >
          {this._foundation[0].cards()}
        </div>
        <div
          data-layout={{
            name: 'foundation2'
          }}
        >
          {this._foundation[1].cards()}
        </div>
        <div
          data-layout={{
            name: 'foundation3'
          }}
        >
          {this._foundation[2].cards()}
        </div>

        <div
          data-layout={{
            name: 'foundation4'
          }}
        >
          {this._foundation[3].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau1'
          }}
        >
          {this._tableau[0].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau2'
          }}
        >
          {this._tableau[1].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau3'
          }}
        >
          {this._tableau[2].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau4'
          }}
        >
          {this._tableau[3].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau5'
          }}
        >
          {this._tableau[4].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau6'
          }}
        >
          {this._tableau[5].cards()}
        </div>

        <div
          data-layout={{
            name: 'tableau7'
          }}
        >
          {this._tableau[6].cards()}
        </div>

        <button data-layout={{
          name: 'New Game',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
            location: { x: 80, y: 80 },
            size: { width: 5, height: 2 }
          }
        }}
          onClick={this.newGame}
        >
          New Game
        </button>

      </ReactLayout>
    );
  }
}

