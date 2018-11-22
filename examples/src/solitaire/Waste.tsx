import * as React from 'react';
import { IUnit } from '../../../src/components/Layout';
import Stock from './Stock';

import { cardHeight, cardHorizontalOffset, cardWidth, wastePosition } from './config';

export interface IWasteProps {
  connect: (i: Waste) => void;
}

export default class Waste extends React.Component<IWasteProps> {

  public waste: string[] = [];

  constructor(props: IWasteProps) {
    super(props);
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public populate = (stock: Stock) => {
    this.waste.map((oldCard) => {
      stock.stock.unshift(oldCard);
    })

    let card = stock.dealOne();
    if (card) {
      this.waste.push(card)
    }
    card = stock.dealOne()
    if (card) {
      this.waste.push(card)
    }
    card = stock.dealOne()
    if (card) {
      this.waste.push(card)
    }
  }

  public path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }

  public createElement(index: number) {
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

  public render = () => {
    return (
      <>
        {this.createElement(0)}
        {this.createElement(1)}
        {this.createElement(2)}
      </>
    )
  }
}