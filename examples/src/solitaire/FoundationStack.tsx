import Stack, {foundationCompare} from './Stack'

export default class FoundationStack {

  private _stack: Stack;

  constructor(update: ()=>void) {
    this._stack = new Stack(true, true, update, foundationCompare);
  }

  public clear = () => {
    this._stack.clear();
  }

  public cards() {
    return this._stack.cards();
  }
}