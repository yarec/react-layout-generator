import { IGenerator } from 'src/importRLG';
import Stack, {allowFoundationDrop} from './Stack'

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
    console.log(`foundatation stack canDrop ${data} `)
    return false
  }

  public drop = (data: string[]) => {
    console.log(`drop ${this._stack.cards.name} `)
    return false
  }

  public endDrop = (data: string[]) => {
    console.log(`endDrop ${this._stack.cards.name} `)
    return false
  }
}