import * as React from 'react';
import { OriginX, OriginY } from '../../src/types';

export default class Deck {

  deck: Array<string>;

  constructor() {
    this.deck = [];
    this.reset();
    this.shuffle();
  }

  reset() {
    this.deck = [];

    const suits = ['H', 'S', 'C', 'D'];
    const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    for (let suit in suits) {
      for (let value in values) {
        this.deck.push(`${values[value]}${suits[suit]}`);
      }
    }
  }

  shuffle = () => {
    const { deck } = this;
    let m = deck.length, i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return this;
  }

  createElement = (index: number) => {
    let e = require(`./assets/cards/${this.deck[index]}.jpg`);
    return (
      <div
        key={this.deck[index]}
        data-layout={{
          name: this.deck[index],
          position: {
            origin: { x: OriginX.Q1, y: OriginY.Q1 },
            position: { x: -50, y: -75 },
            size: { x: 100, y: 150 }
          }
        }} >
        <img width={100} height={150} src={e} />
      </div >
    )
  }

  createElements = (): Array<any> => {
    let index = 0;
    let a = new Array<any>();
    this.deck.forEach((card) => {
      a.push( this.createElement(index++));
    })
    return a;
  }

  render = () => {
    console.log('Deck render')
    return (
      <>
        {...this.createElements()}
      </>
    )
  }

}
