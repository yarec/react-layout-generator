import { Params } from './Params'
import { Block } from './Block'

export interface ILayersProps {
  name: string
  params: Params
}

export class Layers {
  private _params: Params

  constructor(props: ILayersProps) {
    this._params = props.params
  }

  public bringForward(block: Block) {
    const current = block.layer()
    let currentFront = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER

    block.generator.blocks().map.forEach((block: Block) => {
      if (block.layer() > current) {
        currentFront = block.layer()
      }
      if (block.layer() > max) {
        max = block.layer()
      }
    })

    const value =
      currentFront < Number.MAX_SAFE_INTEGER
        ? currentFront + 1
        : max === Number.MIN_SAFE_INTEGER
        ? block.layer()
        : max + 1

    this._params.set(`${block.name}ZIndex`, value)
    block.updateLayer(value)

    return value
  }

  public bringFront(block: Block) {
    let max = Number.MIN_SAFE_INTEGER

    block.generator.blocks().map.forEach((block: Block) => {
      if (block.layer() > max) {
        max = block.layer()
      }
    })

    const value = max + 1

    this._params.set(`${block.name}ZIndex`, value)
    block.updateLayer(value)

    return value
  }

  public sendBackward(block: Block) {
    const current = block.layer()
    let currentBack = Number.MIN_SAFE_INTEGER
    let min = Number.MAX_SAFE_INTEGER

    block.generator.blocks().map.forEach((block: Block) => {
      if (block.layer() < current) {
        currentBack = block.layer()
      }
      if (block.layer() < min) {
        min = block.layer()
      }
    })

    const value =
      currentBack > Number.MIN_SAFE_INTEGER
        ? currentBack - 1
        : min === Number.MAX_SAFE_INTEGER
        ? block.layer()
        : min - 1

    this._params.set(`${block.name}ZIndex`, value)
    block.updateLayer(value)

    return value
  }

  public sendBack(block: Block) {
    let min = Number.MAX_SAFE_INTEGER

    block.generator.blocks().map.forEach((block: Block) => {
      if (block.layer() < min) {
        min = block.layer()
      }
    })

    const value = min - 1

    this._params.set(`${block.name}ZIndex`, value)
    block.updateLayer(value)

    return value
  }
}
