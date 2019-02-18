import { IGenerator } from '../generators/Generator'
import { Block } from './Block'
import { IDataLayout } from '../components/blockTypes'

/**
 * Blocks managed the Block collection.
 */

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

  /**
   * This method returns the array of Blocks that match the
   * specified layer. If there is no layer for a Block it is treated
   * as having layer 0.
   */
  public layers(layer: number): Block[] {
    if (this._blocks.size === 0) {
      console.error(``)
    }
    const blocks: Block[] = []
    this._blocks.forEach(block => {
      const blockLayer = block.layer
      if (blockLayer) {
        if (layer === blockLayer) {
          blocks.push(block)
        }
      } else if (layer === 0) {
        blocks.push(block)
      }
    })
    return blocks
  }

  /**
   * This gets the underlying Map <string, Block> that
   * this class manages.
   */
  get map() {
    return this._blocks
  }

  /**
   * Returns the number of blocks.
   */
  get size() {
    return this._blocks.size
  }

  /**
   * This method returns the i th block in insert order.
   */
  public find(i: number) {
    // console.log(Object.keys(this._blocks))
    // const key = Object.keys(this._blocks)[i];
    return this._byIndex[i]
  }

  /**
   * This method returns the block by name.
   */
  public get(key: string) {
    return this._blocks.get(key)
  }

  /**
   * Set will create block if it does not exist otherwise it will just update the block.
   */
  public set(key: string, p: IDataLayout, g: IGenerator): Block {
    let block = this._blocks.get(key)
    if (block) {
      block.updatePosition(p)
    } else {
      block = new Block(key, p, g)
      this._blocks.set(key, block)
      if (this._blocks.size > this._byIndex.length) {
        // Add to byIndex array
        this._byIndex.push(block)
      }
    }
    return block
  }
}
