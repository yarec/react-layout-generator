import * as React from 'react';
import { IUnit } from '../../../src/components/Layout';
import Stock from './Stock';

import { cardWidth, cardHeight, cardHorizontalOffset, wastePosition } from './config';

export interface WasteProps {
  connect: (i: Waste) => void;
}

export default class Waste extends React.Component<WasteProps> {

  waste: Array<string> = [];

  constructor(props: WasteProps) {
    super(props);
  }

  componentDidMount = () => {
    this.props.connect(this);
  }

  populate = (stock: Stock) => {
    this.waste.map((card) => {
      stock.stock.unshift(card);
    })

    let card;
    if (card = stock.dealOne()) {
      this.waste.push(card)
    }
    if (card = stock.dealOne()) {
      this.waste.push(card)
    }
    if (card = stock.dealOne()) {
      this.waste.push(card)
    }
  }

  path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }

  createElement(index: number) {
    if (index < this.waste.length) {
      const name = this.waste[index];
      const id = `waste${index + 1}`;
      return (
        <div
          key={`${name}${index + 1}`}
          data-layout={{
            name: id,
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
              location: { x: wastePosition.x + index * cardHorizontalOffset, y: wastePosition.y },
              size: { width: cardWidth, height: cardHeight }
            }
          }}
        >
          <img src={this.path(name)} />
        </div >
      );
    }
    return null;
  }

  render = () => {
    return (
      <>
        {this.createElement(0)}
        {this.createElement(1)}
        {this.createElement(2)}
      </>
    )
  }
}