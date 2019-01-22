import { Block, IPosition } from '../components/Block'
import { Blocks } from '../components/Blocks'
import { Params } from '../components/Params'
import { EditHelper } from '../editors/EditHelper'
import { RLGSelect } from '../editors/RLGSelect'
import { Layers } from '../components/Layers'
import { ISize } from '../types'

export interface IGeneratorFunctionArgs {
  name: string
  exParams?: Params
  editHelper?: EditHelper
}

/**
 *
 */
export type IInit = (g: IGenerator) => Blocks

export interface ICreate {
  name: string
  g: IGenerator
  position: IPosition
  index?: number
  count?: number
}

export type Create = (args: ICreate) => Block | undefined

export interface IGenerator {
  name: () => string
  params: () => Params
  blocks: () => Blocks
  layers: () => Layers
  reset: () => void
  // next: () => Block | undefined
  lookup: (name: string) => Block | undefined
  containersize: (name: string) => ISize | undefined
  clear: () => void
  create?: Create
  editor?: () => EditHelper | undefined
}

export class Generator implements IGenerator {
  public currentLayout: Block | undefined

  private _name: string
  private _editHelper: EditHelper | undefined
  private _params: Params
  private _blocks: Blocks
  private _layers: Layers
  private _select: RLGSelect
  private _init: IInit
  private _create: Create | undefined

  constructor(
    name: string,
    init: IInit,
    params: Params,
    create?: Create,
    editHelper?: EditHelper
  ) {
    this._name = name
    this._init = init
    this._editHelper = editHelper
    this._create = create
    this._blocks = new Blocks([])
    // this._blocksIterator = this._blocks.values()
    // this.state = this.start
    this._params = params

    this._layers = new Layers({ name, params, blocks: this._blocks })
  }

  public name = () => {
    return this._name
  }

  public editHelper = () => {
    return this._editHelper
  }

  public params = (): Params => {
    return this._params
  }

  public blocks = (): Blocks => {
    return this._blocks
  }

  public layers = (): Layers => {
    return this._layers
  }

  public select = (): RLGSelect => {
    return this._select
  }

  public lookup = (name: string): Block | undefined => {
    return this._blocks.get(name)
  }

  public containersize = (name: string): ISize => {
    const l = this._blocks.get(name)
    if (l) {
      const r = l.rect()

      return { width: r.width, height: r.height }
    }

    return { width: 0, height: 0 }
  }

  public create = (args: ICreate): Block | undefined => {
    if (this._create) {
      return this._create(args)
    }
    return undefined
  }

  public reset = () => {
    this._blocks = this._init(this)
  }

  public clear = () => {
    this._blocks.map.clear()
  }
}
