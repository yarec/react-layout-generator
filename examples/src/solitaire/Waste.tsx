import * as React from 'react';

import Stock from './Stock';

export default class Waste {

  private waste: string[] = [];

  public populate = (stock: Stock) => {
    this.waste.map((oldCard) => {
      stock.unshift(oldCard);
    })

    this.waste = [];
    
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


  public clear = () => {
    this.waste = [];
  }

  public cards = () => {
    return this.createElements();
  }

  private createElement = (card: string) => {
    return (
      <img key={card} src={this.path(name)} />
    )
  }

  private createElements = () => {
    return this.waste.map((card) => {
      return this.createElement(card);
    })
  }

  private path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }

}