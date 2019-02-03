import { IGenerator } from '../importRLG'
import { gCards } from './Card'
import Stack, { isRedSuite } from './Stack'

export default class FoundationStack {
  protected _name: string
  private _stack: Stack

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

  public cards() {
    return this._stack.cards()
  }

  public canDrop(data: string[]) {
    let result = false
    const first = gCards.get(data[0])
    if (first && data.length === 1) {
      if (this._stack.length === 0) {
        result = first.rank === 1
        // console.log(`can drop foundation ${this._name} ${first}`, result)
      } else {
        const last = this._stack.last
        if (last) {
          result =
            last.rank - first.rank === -1 &&
            isRedSuite(last.suite) === isRedSuite(first.suite)
          // console.log(
          //  `can drop foundation ${this._name} ${first.name} on ${last.name}`,
          ///  result
          // )
        }
      }
    }
    console.log(
      `can drop foundation final ${top ? top.name : undefined}`,
      result
    )
    return result
  }

  public drop(data: string[]) {
    console.log(`foundation drop ${this._stack.cards.name} `)
    if (data.length === 1) {
      const card = gCards.get(data[0])
      if (card) {
        this._stack.push(card)
        return true
      }
    }
    return false
  }

  public endDrop(data: string[]) {
    console.log(`foundation endDrop ${this._stack.cards.name} `)
    this._stack.pop()
    return true
  }
}
