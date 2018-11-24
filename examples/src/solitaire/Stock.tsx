import * as React from 'react';

import Deck from '../algos/Deck';

export default class Stock  {
  private _deck: Deck = new Deck();

  constructor() {
    this._deck.reset();
    this._deck.shuffle();
  }

  public shuffle = () => {
    this._deck.shuffle();
  }

  public pop = () => {
    return this._deck.cards.pop();
  }

  public unshift = (card: string) => {
    return this._deck.cards.unshift(card);
  }

  public cards = () => {
    return this.createElements();
  }

  private createElement = (card: string) => {
    const e = require(`../assets/cards/${card}.jpg`);
    return (
        <img width={'100%'} height={'100%'} src={e} />
    )
  }

  private createElements = () => {
    return this._deck.cards.map((card) => {
      return this.createElement(card);
    })
  }
}