import * as React from 'react';

import { IUnit, PositionRef } from '../../../src/components/Layout';

// tslint:disable-next-line:no-empty-interface
interface IDeck {
}

export default class Deck extends React.Component<IDeck> {

  private deck: string[] = [];

  constructor(props: IDeck) {
    super(props);
    this.deck = [];
    this.reset();
    this.shuffle();
  }

  public reset() {
    this.deck = [];

    const suits = ['H', 'S', 'C', 'D'];
    const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    for (const suit in suits) {
      if (suit) {
        for (const value in values) {
          if (value) {
            this.deck.push(`${values[value]}${suits[suit]}`);
          }
        }
      }
    }
  }

  public shuffle = () => {
    const { deck } = this;
    let i;
    let m = deck.length;

    while (m) {
      i = Math.floor(Math.random() * m--);

      [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return this;
  }

  public createElement = (index: number) => {
    const e = require(`../assets/cards/${this.deck[index]}.jpg`);

    return (
      <div
        key={this.deck[index]}
        data-layout={{
          name: this.deck[index],
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
            location: { x: 25, y: 25 },
            edit: [{ ref: PositionRef.position }],
            size: { width: 100, height: 150 }
          }
        }} >
        <img width={100} height={150} src={e} />
      </div >
    )
  }

  public createElements = (): any[] => {
    let index = 0;
    const a: JSX.Element[] = [];
    this.deck.forEach((card) => {
      a.push(this.createElement(index++));
    })

    const e = require(`../assets/cards/back.jpg`);
    const back =
      <div
        key={'back'}
        data-layout={{
          name: 'back',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
            location: { x: 25, y: 25 },
            edit: [{ ref: PositionRef.position }],
            size: { width: 100, height: 150 }
          }
        }} >
        <img width={100} height={150} src={e} />
      </div >
    a.push(back);
    return a;
  }

  public render = () => {
    // console.log('Deck render')
    return (
      <>
        {...this.createElements()}
      </>
    )
  }

}
