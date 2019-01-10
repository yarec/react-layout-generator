import { Block, IPosition } from '../components/Block'
import { Blocks } from '../components/Blocks'
import { Params, ParamValue } from '../components/Params'
import { EditHelper } from '../editors/EditHelper'
import { RLGSelect } from '../editors/RLGSelect'
import { ISize } from '../types'

export interface IGeneratorFunctionArgs {
  name: string
  exParams?: Params
  editHelper?: EditHelper
}

export type IInit = (g: IGenerator) => Blocks
export interface ICreate {
  index: number
  count: number
  name: string
  g: IGenerator
  position: IPosition
}

export type Create = (args: ICreate) => Block | undefined

export interface IGenerator {
  name: () => string
  params: () => Params
  blocks: () => Blocks
  reset: () => void
  next: () => Block | undefined
  lookup: (name: string) => Block | undefined
  containersize: (name: string) => ISize | undefined
  clear: () => void
  create?: Create
  editor?: () => EditHelper | undefined
}

export class Generator implements IGenerator {
  public currentLayout: Block | undefined

  public state: () => Block | undefined
  private _name: string
  private _editHelper: EditHelper | undefined
  private _params: Params
  private _blocks: Blocks
  private _select: RLGSelect
  private _blocksIterator: IterableIterator<Block> | undefined
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
    this._blocksIterator = this._blocks.values()
    this.state = this.start
    this._params = params
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
    // console.log('reset update blocks')
    this._blocks = this._init(this)
    this.state = this.start
    this._blocksIterator = this._blocks.values()
    // this._blocks.blocks.forEach((item: Layout) => {
    //   if (item.g) {
    //     item.g.reset();
    //   }
    // })
  }

  public clear = () => {
    this._blocks = new Blocks([])
    this.state = this.start
    this._blocksIterator = this._blocks.values()
  }

  public start = (): Block | undefined => {
    return this.nextBlock()
  }

  public next = (): Block | undefined => {
    return this.state()
  }

  protected setup = (values: Array<[string, ParamValue]>) => {
    if (this._params.get('$setup', true) === undefined) {
      this._params.set('$setup', 1)
      values.forEach((value: [string, ParamValue]) => {
        this._params.set(value[0], value[1])
      })
    }
  }

  private nextBlock = (): Block | undefined => {
    this.currentLayout = this._blocksIterator!.next().value
    if (this.currentLayout) {
      // if (this.currentLayout.g) {
      //   this.state = this.nestedBlock;
      //   return this.nestedBlock();
      // } else {
      this.state = this.nextTile
      return this.nextTile()
      // }
    } else {
      this.state = this.start
      return undefined
    }
  }

  // private nestedBlock = (): Layout | undefined => {
  //   let b: Layout | undefined = undefined;
  //   if (this.currentLayout && this.currentLayout.g) {
  //     b = this.currentLayout.g.next();
  //   }
  //   if (b === undefined) {
  //     this.state = this.nextBlock;
  //     return this.nextBlock();
  //   }
  //   return b;
  // }

  private nextTile = (): Block | undefined => {
    const b: Block | undefined = this.currentLayout
    if (b) {
      this.state = this.nextBlock
    }

    return b
  }
}
