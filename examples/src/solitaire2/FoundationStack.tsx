import { IGenerator } from '../importRLG';
import { gCards } from './Card';
import Stack, {allowFoundationDrop, isRedSuite} from './Stack'

export default class FoundationStack {

  private _stack: Stack;

  constructor(update: ()=>void, g: IGenerator) {
    this._stack = new Stack(true, true, update, g, allowFoundationDrop);
  }

  public clear = () => {
    this._stack.clear();
  }

  public cards() {
    return this._stack.cards();
  }

  public canDrop = (data: string[]) => {
    let result = false
    const top = gCards.get(data[0])
    if (this._stack.length === 0) {
      if (top) {
        result = top.rank === 1
      }
    } else if (data.length === 1) {
      const tail = this._stack[this._stack.length - 1]
      if (top) {
        result = tail.rank - top.rank === -1 &&
        isRedSuite(tail.suite) === isRedSuite(top.suite)
      }
    }
    console.log(`can drop foundation ${data[0]}`, result);
    return result
  }

  public drop = (data: string[]) => {
    console.log(`foundation drop ${this._stack.cards.name} `)
    return false
  }

  public endDrop = (data: string[]) => {
    console.log(`foundation endDrop ${this._stack.cards.name} `)
    return false
  }
}