import * as React from 'react';

import Stock from './Stock';

export default class TableauStack {
  private _stack: string[] = [];

  public clear = () => {
    this._stack = [];
  }

  public populate(stock: Stock, index: number) {
    this._stack = [];
    for (let i = 1; i < index; i++) {
      const card = stock.pop();
      if (card) {
        this._stack.push(card);
      }
    }
  }

  public cards() {
    return this._stack.map((name, i) => {
      return (
        <img key={name} src={this.path(name)} />
      );
    })
  }

  private path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }
}