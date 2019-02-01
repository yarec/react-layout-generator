import { IGenerator } from '../importRLG'
import Card, { gCards } from './Card';
import Stack, { allowTableauDrop, isRedSuite } from './Stack'
import Stock from './Stock'

export default class TableauStack {
  private _stack: Stack 

  constructor(update: () => void, g: IGenerator) {
    this._stack = new Stack(true, true, update, g, allowTableauDrop)

    this.canDrop = this.canDrop.bind(this)
  }

  public clear() {
    this._stack.clear()
  }

  public populate(stock: Stock, index: number) {
    this._stack.clear()
    for (let i = 0; i <= index; i++) {
      const card = stock.pop()
      if (card) {
        this._stack.push(card)
      }
    }

    const top = this._stack.top()
    if (top) {
      top.flip()
    }
  }

  public cards() {
    return this._stack.cards()
  }

  public canDrop (data: string[]) {
    let result = false
    const top = gCards.get(data[0])
    if (top) {
      if (this._stack.length === 0) {
        if (top) {
          result = top.rank === 13
          console.log(`can drop tableau ${top.name}`, result);
        }
      } else if (this._stack.length) {
        const index = this._stack.length - 1
        const tail: Card = this._stack[index]
        if (tail && top) {
          result = tail.rank - top.rank === -1 &&
          isRedSuite(tail.suite) !== isRedSuite(top.suite)
          console.log(`can drop tableau ${top.name} on ${tail.name}`, result);
        }
      }
    }
    
    return result
  }

  public drop (data: string[]) {
    console.log(`foundation drop ${this._stack.cards.name} `)
    return false
  }

  public endDrop (data: string[]) {
    console.log(`foundation endDrop ${this._stack.cards.name} `)
    return false
  }
}
