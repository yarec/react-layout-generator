import * as React from 'react';

export default class FoundationStack {

  private stack: string[] = [];

  public clear = () => {
    this.stack = [];
  }

  public cards() {
    return this.stack.map((name, i) => {
      return (
        <img key={name} src={this.path(name)} />
      );
    })
  }

  public drop(card: string) {
    this.stack.push(card)
  }

  private path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }


}