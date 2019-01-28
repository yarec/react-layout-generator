import { IGenerator } from '../generators/Generator'
import { Block, IPosition } from './Block'

export class Blocks {
  private _blocks: Map<string, Block>
  private _byIndex: Block[]

  constructor(blocks: Array<[string, Block]>) {
    this._byIndex = new Array()
    this._blocks = new Map(blocks)
    this._blocks.forEach(value => {
      this._byIndex.push(value)
    })
  }

  public values() {
    return this._blocks.values()
  }

  get map() {
    return this._blocks
  }

  get size() {
    return this._blocks.size
  }

  public find(i: number) {
    // console.log(Object.keys(this._blocks))
    // const key = Object.keys(this._blocks)[i];
    return this._byIndex[i]
  }

  public get(key: string) {
    return this._blocks.get(key)
  }

  public set(
    key: string,
    p: IPosition,
    g: IGenerator,
    localParent?: Block
  ): Block {
    let block = this._blocks.get(key)
    if (block) {
      block.updatePosition(p)
    } else {
      block = new Block(key, p, g, localParent)
      this._blocks.set(key, block)
      if (this._blocks.size > this._byIndex.length) {
        // Add to byIndex array
        this._byIndex.push(block)
      }
    }
    return block
  }
}
