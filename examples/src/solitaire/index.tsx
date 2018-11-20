import * as React from 'react';
import ReactLayout from '../../../src/ReactLayout';
import { IGenerator } from '../../../src/generators/Generator';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import { IUnit } from '../../../src/components/Layout'

import Stock from './Stock';
import Waste from './Waste';
import Foundation from './Foundation';
import Tableau from './Tableau';

// import { cardWidth, cardHeight, cardHorizontalOffset, wastePosition } from './config';


/**
 * This class and other solitaire components need to know the instance values
 * of its children. This is done by passing a callback connect function to each
 * child which is called in their componentDidMount method.
 */

 /**
  * Names of layouts are based on position not on the card names.
  */

interface SolitaireProps {
  name?: string;
}

export default class Solitaire extends React.PureComponent<SolitaireProps> {

  g: IGenerator;

  stock: Stock;
  waste: Waste;
  foundation: Array<Foundation> = [];
  tableau: Array<Tableau> = [];

  constructor(props: SolitaireProps) {
    super(props);
    this.g = RLGDynamic('rlg.solitaire.example');
  }

  _stock = (stock: Stock) => {
    this.stock = stock;
  }

  _waste = (waste: Waste) => {
    this.waste = waste;
  }

  _tableau = (tableau: Tableau) => {
    this.tableau.push(tableau);
  }

  _foundation = (foundation: Foundation) => {
    this.foundation.push(foundation);
  }

  /**
   * Moves the top cards to the tableau after each shuffle.
   */
  shuffleAndPopulate = () => {
    if (this.stock && this.tableau) {
      this.stock.shuffle();
      this.tableau.map((tableau) => {
        tableau.populate(this.stock);
      });
    }
  }

  /**
   * Moves the top (3) cards to the waste pushing any
   * existing cards to the stock.
   */
  populateWaste = () => {
    if (this.stock && this.waste) {
      this.waste.populate(this.stock);
    }
  }

  render() {

    return (
      <>
        <ReactLayout
          g={this.g}
        >
          <Stock data-layout={{
            name: 'stock',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
              location: { x: 25, y: 25 },
              size: { width: 100, height: 150 }
            }
          }} connect={this._stock} />

          <Waste data-layout={{
            name: 'waste',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 25 },
              size: { width: 100, height: 150 }
            }
          }} connect={this._waste} />

          <Foundation data-layout={{
            name: 'foundation',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 25 },
              size: { width: 100, height: 150 }
            }
          }}
            connect={this._foundation}
            g={this.g}
          />

          <Tableau data-layout={{
            name: 'tableau',
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
              location: { x: 250, y: 250 },
              size: { width: 100, height: 150 }
            }
          }}
            connect={this._tableau}
            g={this.g}
          />

        </ReactLayout>
      </>
    );
  }
}