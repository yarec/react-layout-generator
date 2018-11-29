import * as React from 'react';

export type IAllowDrop = (card: string, topCard: string) => boolean | undefined;

/**
 * Chrome does not handle the dataTransfer correctly for the onDragOver. Ugg...
 * The workaround is to use a global data to capture the data being transferred. 
 */

let gDataTransfer: string = '';

export default class Stack {
  private _stack: string[] = [];
  private _update: () => void;
  private _drag: boolean;
  private _drop: boolean;
  private _allowDrop: IAllowDrop | undefined;

  constructor(drag: boolean, drop: boolean, update: () => void, allowDrop?: IAllowDrop) {
    this._drag = drag;
    this._drop = drop;
    this._update = update;
    this._allowDrop = allowDrop;
  }

  public clear = () => {
    this._stack = [];
  }

  public pop = () => {
    return this._stack.pop();
  }

  public push = (card: string) => {
    return this._stack.push(card);
  }

  public unshift = (card: string) => {
    this._stack.unshift(card);
  }

  public cards = () => {
    if (this._stack.length) {
      return this._stack.map((name, i) => {
        if (this._drag && this._drop) {
          return (
            <img
              id={name}
              key={name}
              draggable={true}
              onDragEnd={this.onDragEnd}
              onDragOver={this.onDragOver}
              onDragStart={this.onDragStart}
              onDrop={this.onDrop}
              src={this.path(name)}
            />
          );
        } else if (this._drag && !this._drop) {
          return (
            <img
              id={name}
              key={name}
              draggable={true}
              onDragStart={this.onDragStart}
              src={this.path(name)}
            />
          );
        } else if (!this._drag && this._drop) {
          return (
            <img
              id={name}
              key={name}
              onDragOver={this.onDragOver}
              onDragEnd={this.onDragEnd}
              onDrop={this.onDrop}
              src={this.path(name)}
            />
          );
        } else {
          return (
            <img
              id={name}
              key={name}
              src={this.path(name)}
            />
          );
        }
      });
    }

    return (<div
      key='empty'
      style={{ borderWidth: 2, borderColor: 'black', borderRadius: 3, backgroundColor: '#FBF8EF' }}
      onDragOver={this.onDragOver}
      onDrop={this.onDrop}
    />)
  }

  public onDrop = (e: React.DragEvent) => {
    const card = gDataTransfer;
    if (card) {
      this._stack.push(card)
    }
  }

  public onDragStart = (e: React.DragEvent) => {
    // tslint:disable-next-line:no-string-literal
    const id = e.target['id'];
    console.log('onDragStart', id)
    gDataTransfer = id;
    // tslint:disable-next-line:no-string-literal
    e.dataTransfer.setData('text/plain', id);
  }

  public onDragOver = (e: React.DragEvent) => {
    if (this._stack.length === 0) {
      e.preventDefault();
    } else {
      if (gDataTransfer) {
        const top = this._stack[this._stack.length - 1];

        if (this._allowDrop && this._allowDrop(gDataTransfer, top)) {
          e.preventDefault();
        }
      }
    }
  }

  public onDragEnd = (e: React.DragEvent) => {
    if (e.dataTransfer.dropEffect === 'move') {
      // Remove
      if (this._stack.length) {
        this._stack.pop();
      }
      // Update 
      this._update();
    }
  }

  private path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }
}

function getCard(card: string) {
  const first = card.split('_');
  let rank: number = Number(first[0]);
  if (isNaN(rank)) {
    if (first[0] === 'J') {
      rank = 11;
    }
    if (first[0] === 'Q') {
      rank = 12;
    }
    if (first[0] === 'K') {
      rank = 13;
    }
    if (first[0] === 'A') {
      rank = 0;
    }
  }
  return ({
    rank,
    suite: first[1]
  });
}

export function isRedSuite(suite: string) {
  return suite === 'H' || suite === 'D';
}

export function descendingCompare(card1: string, card2: string) {
  if (card2 === undefined || card2.length === 0) {
    return true;
  }
  const first = getCard(card1);
  const second = getCard(card2);

  return (first.rank - second.rank === -1) && isRedSuite(first.suite) !== isRedSuite(second.suite);
}

export function ascendingCompare(card1: string, card2: string) {
  if (card2 === undefined || card2.length === 0) {
    return true;
  }
  const first = getCard(card1);
  const second = getCard(card2);

  return (first.rank - second.rank === 1) && isRedSuite(first.suite) !== isRedSuite(second.suite);
}