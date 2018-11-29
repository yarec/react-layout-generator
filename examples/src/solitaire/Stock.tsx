import Deck from '../algos/Deck';
import Stack from './Stack';

export default class Stock  {
  private _deck: Deck = new Deck();
  private _stack: Stack;

  constructor(update: ()=>void) {
    this._stack = new Stack(false, false, update);
    this._deck.reset();
    this._deck.shuffle();
  }

  public shuffle = () => {
    this._deck.reset();
    this._deck.shuffle();

    this._stack.clear();
    this._deck.cards.map((card) => {
      this._stack.push(card);
    });
  }

  public pop = () => {
    return this._stack.pop();
  }

  public unshift = (card: string) => {
    return this._stack.unshift(card);
  }

  public cards = () => {
    return this._stack.cards();
  }
}