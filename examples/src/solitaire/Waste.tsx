import * as React from 'react';

import { IUnit } from '../../../src/components/Layout';
import { IGenerator } from '../../../src/generators/Generator';
import ReactLayout from '../../../src/ReactLayout'
import Stock from './Stock';

import { 
  cardHeight, 
  cardHorizontalOffset, 
  cardWidth, 
  wasteGenerator, 
  wastePosition } from './config';

export interface IWasteProps {
  connect: (i: Waste) => void;
  g: IGenerator;
}

export default class Waste extends React.Component<IWasteProps> {

  private waste: string[] = [];
  private _g: IGenerator;

  constructor(props: IWasteProps) {
    super(props);
    this._g = this.props.g;
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public populate = (stock: Stock) => {
    this.waste.map((oldCard) => {
      stock.unshift(oldCard);
    })

    let card = stock.pop();
    if (card) {
      this.waste.push(card)
    }
    card = stock.pop()
    if (card) {
      this.waste.push(card)
    }
    card = stock.pop()
    if (card) {
      this.waste.push(card)
    }
  }

  public path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }

  public clear = () => {
    this._g.clear();
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
      <ReactLayout 
        g={wasteGenerator}
      >
        {this.createElement(0)}
        {this.createElement(1)}
        {this.createElement(2)}
      </ReactLayout>
    )
  }
}