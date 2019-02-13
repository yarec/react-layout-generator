import { Block } from '../components/Block'
import { IPosition } from '../components/blockTypes'
import { Blocks } from '../components/Blocks'
import { Params } from '../components/Params'
import { EditHelper } from '../editors/EditHelper'
import { RLGSelect } from '../editors/RLGSelect'
import { Stacking } from '../components/Stacking'
import { Hooks } from '../components/Hooks'

export interface IGeneratorFunctionArgs {
  name: string
  exParams?: Params
  editHelper?: EditHelper
}

/**
 *
 */
export type IInit = (g: IGenerator) => Blocks

export type IHook = (g: IGenerator) => void

export interface ICreate {
  name: string
  g: IGenerator
  position: IPosition
  index?: number
  count?: number
}

export type Create = (args: ICreate) => Block | undefined

export interface IGenerator {
  /**
   * Name of the generator.
   */
  name: () => string
  /**
   * Returns the [params](#Params) that used with this Generator.
   */
  params: () => Params
  /**
   * Returns the [Blocks](#Blocks) manager for this Generator.
   */
  blocks: () => Blocks
  /**
   * This component provides methods to manipulate the [stacking](#Stacking)
   * order within a layer.
   */
  stacking: () => Stacking
  /**
   * Reset invokes the [init function](#IInit) in a Generator. It is called at the
   * beginning of each render. It will also call any [hook functions](#fnHook)
   * at the same time.
   */
  reset: () => void
  /**
   * Returns the named Block or undefined.
   */
  lookup: (name: string) => Block | undefined
  /**
   * This will remove all Blocks forcing the blocks to be recreated on the next
   * render.
   */
  clear: () => void
  /**
   * This will return the [Hooks](#Hooks) for this generator. A Hook is a function that
   * is called each time reset is called at the beginning of each render. One use a Hook
   * to perform animation on a layer. See [rollHook](#rollHook) as a an example.
   */
  hooks: () => Hooks
  /**
   * This is function that is called in a generator to create a new Block. It is an optional
   * function.
   */
  create?: Create
  /**
   * [EditHelper](#EditHelper) is used to sync builtin edit commands with a custom Editor.
   */
  editor?: () => EditHelper | undefined
}

export class Generator implements IGenerator {
  public currentLayout: Block | undefined

  private _name: string
  private _editHelper: EditHelper | undefined
  private _params: Params
  private _blocks: Blocks
  private _stacking: Stacking
  private _select: RLGSelect
  private _init: IInit
  private _hooks: Hooks
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

    this._stacking = new Stacking({ name, params, blocks: this._blocks })

    this._hooks = new Hooks()
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

  public stacking = (): Stacking => {
    return this._stacking
  }

  public select = (): RLGSelect => {
    return this._select
  }

  public lookup = (name: string): Block | undefined => {
    return this._blocks.get(name)
  }

  public hooks() {
    return this._hooks
  }

  // public containersize = (name: string): ISize => {
  //   const l = this._blocks.get(name)
  //   if (l) {
  //     const r = l.rect

  //     return { width: r.width, height: r.height }
  //   }

  //   return { width: 0, height: 0 }
  // }

  public create = (args: ICreate): Block | undefined => {
    if (this._create) {
      return this._create(args)
    }
    return undefined
  }

  public reset = () => {
    this._blocks = this._init(this)
    this._hooks.run(this)
  }

  public clear = () => {
    this._blocks.map.clear()
  }
}
