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

  private _g: IGenerator;

  private _stock: Stock;
  private _waste: Waste;
  private _foundation: Foundation[] = [];
  private _tableau: Tableau[] = [];

  constructor(props: ISolitaireProps) {
    super(props);
    this._g = RLGDynamic('rlg.solitaire.example');
  }

  public setStock(stock: Stock) {
    this._stock = stock;
  }

  public setWaste(waste: Waste) {
    this._waste = waste;
  }

  public setTableau(tableau: Tableau) {
    this._tableau.push(tableau);
  }

  public setFoundation(foundation: Foundation) {
    this._foundation.push(foundation);
  }

  /**
   * Moves the top cards to the tableau after each shuffle.
   */
  public shuffleAndPopulate = () => {
    if (this._stock && this._tableau) {
      this._stock.shuffle();
      this._tableau.map((tableau) => {
        tableau.populate(this._stock);
      });
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
        name='Solitaire'
        editLayout={false}
        g={this._g}
      >
        <Stock
          data-layout={{
            name: 'stock',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
              location: { x: 25, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
          connect={this.setStock}
        />

        <Waste
          data-layout={{
            name: 'waste',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
          connect={this.setWaste}
        />

        <Foundation
          data-layout={{
            name: 'foundation',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
          connect={this.setFoundation}
          g={this._g}
        />

        <Tableau data-layout={{
          name: 'tableau',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
            location: { x: 250, y: 250 },
            size: { width: 100, height: 150 }
          }
        }}
          connect={this.setTableau}
          g={this._g}
        />
      </ReactLayout>
    );
  }
}

