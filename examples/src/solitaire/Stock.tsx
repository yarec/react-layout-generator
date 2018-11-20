import * as React from 'react';
import {IUnit  } from '../../../src/components/Layout';

interface StockProps {
  connect: (i: Stock) => void;
}

export default class Stock extends React.Component<StockProps> {

  stock: Array<string>;

  constructor(props: StockProps) {
    super(props);
    this.stock = [];
    this.reset();
    this.shuffle();
  }

  reset() {
    this.stock = [];

    const suits = ['H', 'S', 'C', 'D'];
    const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    for (let suit in suits) {
      for (let value in values) {
        this.stock.push(`${values[value]}${suits[suit]}`);
      }
    }
  }

  shuffle = () => {
    const { stock } = this;
    let m = stock.length, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      [stock[m], stock[i]] = [stock[i], stock[m]];
    }

    return this;
  }

  componentDidMount = () => {
    this.props.connect(this);
  }

  dealOne = () => {
    return this.stock.pop();
  }

  render = () => {
    const index = this.stock.length - 1;
    const e = require('../assets/cards/back.jpg')
    return (
      <div
        key={this.stock[index]}
        data-layout={{
          name: this.stock[index],
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
            location: { x: 25, y: 25 },
            size: { width: 100, height: 150 }
          }
        }} >
        <img width={100} height={150} src={e} />
      </div >
    )
  }
}