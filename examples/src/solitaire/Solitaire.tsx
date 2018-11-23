import * as React from 'react';

import { IUnit } from '../../../src/components/Layout'
import { IGenerator } from '../../../src/generators/Generator';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';

import Foundation from './Foundation';
import Stock from './Stock';
import Tableau from './Tableau';
import Waste from './Waste';

/**
 * This class and other solitaire components need to know the instance values
 * of its children. This is done by passing a callback connect function to each
 * child which is called in their componentDidMount method.
 */

/**
 * Names of layouts are based on position not on the card names.
 */

export interface ISolitaireProps {
  name?: string;
}

export default class Solitaire extends React.Component<ISolitaireProps> {

  private _g: IGenerator = RLGDynamic('rlg.solitaire.example');

  private _stock: Stock;
  private _waste: Waste;
  private _foundation: Foundation;
  private _tableau: Tableau;

  constructor(props: ISolitaireProps) {
    super(props);
  }

  public setStock(stock: Stock) {
    this._stock = stock;
  }

  public setWaste(waste: Waste) {
    this._waste = waste;
  }

  public setTableau(tableau: Tableau) {
    this._tableau = tableau;
  }

  public setFoundation(foundation: Foundation) {
    this._foundation = foundation;
  }

  /**
   * Moves the top cards to the tableau after each shuffle.
   */
  public shuffleAndPopulate = () => {
    if (this._stock && this._tableau) {
      this._stock.shuffle();
      this._foundation.clear();
      this._waste.clear();
      this._tableau.clear();
      this._tableau.populate(this._stock);
    }
  }

  /**
   * Moves the top (3) cards to the waste pushing any
   * existing cards to the stock.
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
            name: 'stock',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 25, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
        >
          <Stock connect={this.setStock} />
        </div>

        <div
          data-layout={{
            name: 'waste',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
        >
          <Waste connect={this.setWaste} />
        </div>

        <div
          data-layout={{
            name: 'foundation',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
        >
          <Foundation connect={this.setFoundation} />
        </div>

        <div
          data-layout={{
            name: 'tableau',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 250 },
              size: { width: 100, height: 150 }
            }
          }}
        >
          <Tableau connect={this.setTableau} />
        </div>
        
      </ReactLayout>
    );
  }
}

