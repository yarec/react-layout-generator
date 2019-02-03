import { IGenerator } from '../importRLG'
import { Face, gCards } from './Card';
import Stack, { isRedSuite } from './Stack'
import Stock from './Stock'

export default class TableauStack {
  private _stack: Stack 
  private _name: string

  constructor(name: string, update: () => void, g: IGenerator) {
    this._stack = new Stack(true, true, update, g)
    this._name = name
    this.canDrop = this.canDrop.bind(this)
    this.drop = this.drop.bind(this)
    this.endDrop = this.endDrop.bind(this)
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

    const top = this._stack.last
    if (top) {
      top.face = Face.up
    }
  }

  public cards() {
    return this._stack.cards()
  }

  public dragData = (id: string) => {
    return this._stack.dragData(id)
  }

  public dragImage = (ids: string[]) => {
    return this._stack.dragImage(ids)
  }

  public canDrop (data: string[]) {
    let result = false
    const first = gCards.get(data[0])
    if (first) {
      if (this._stack.length === 0) {
        result = first.rank === 13
        // console.log(`can drop tableau ${this._name} ${first.name}`, result);
      } else {
        const last = this._stack.last
        if (last) {
          result = last.rank - first.rank === 1 &&
            isRedSuite(last.suite) !== isRedSuite(first.suite)
          console.log(`can drop tableau ${this._name} ${first.name} on ${last.name}`, result);
        }
      }
    }
    
    return result
  }

  public drop (data: string[]) {
    console.log(`tableau drop ${this._name} ${data[0]} on ${this._stack.last ? this._stack.last.name : 'undefined'} `)
    data.forEach((name) => {
      const card = gCards.get(name)
      if (card) {
        this._stack.push(card)
      }
    })
    return true
  }

  public endDrop (data: string[]) {
    console.log(`tableau endDrop ${this._name} ${this._stack.cards.name} `)
    data.forEach((name) => {
        this._stack.pop()
    })
    // Turn up top card
    const last = this._stack.last
    if (last && last.face === Face.down) {
      last.face = Face.up
    }
    return true
  }
}
