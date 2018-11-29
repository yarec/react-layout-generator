import Stack from './Stack';
import Stock from './Stock';

export default class Waste {

  private _waste: Stack;

  constructor(update: ()=>void) {
    this._waste = new Stack(true, true, update);
  }

  public populate = (stock: Stock) => {
    let oldCard = this._waste.pop();
    while(oldCard) {
      stock.unshift(oldCard);
      oldCard = this._waste.pop();
    }

    this._waste.clear();

    let card = stock.pop();
    if (card) {
      this._waste.push(card)
    }
    card = stock.pop()
    if (card) {
      this._waste.push(card)
    }
    card = stock.pop()
    if (card) {
      this._waste.push(card)
    }
  }

  public clear = () => {
    this._waste.clear();
  }

  public cards = () => {
    return this._waste.cards();
  }
}