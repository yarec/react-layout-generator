import * as React from 'react';

import { IUnit } from '../../../src/components/Layout';
import { cardHeight, cardWidth, stockPosition } from './config';

interface IStockProps {
  connect: (i: Stock) => void;
}

export default class Stock extends React.Component<IStockProps> {

  public stock: string[] = [];

  constructor(props: IStockProps) {
    super(props);
    this.stock = [];
    this.reset();
    this.shuffle();
  }

  public reset() {
    this.stock = [];

    const suits = ['H', 'S', 'C', 'D'];
    const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    for (const suit in suits) {
      if (suit) {
        for (const value in values) {
          if (value) {
            this.stock.push(`${values[value]}${suits[suit]}`);
          }
        }
      }
    }
  }

  public shuffle = () => {
    const { stock } = this;
    let m = stock.length;
    let i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      [stock[m], stock[i]] = [stock[i], stock[m]];
    }

    return this;
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public dealOne = () => {
    return this.stock.pop();
  }

  public render = () => {
    const index = this.stock.length - 1;
    const e = require('../assets/cards/back.jpg')
    return (
      <div
        key={this.stock[index]}
        data-layout={{
          name: this.stock[index],
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
            location: { x: stockPosition.x, y: stockPosition.y },
            size: { width: cardWidth, height: cardHeight }
          }
        }} >
        <img width={100} height={150} src={e} />
      </div >
    )
  }
}