import { Block } from '../components/Block'
import { IDataLayout } from '../components/blockTypes'
import { Blocks } from '../components/Blocks'
import { Params } from '../components/Params'
import { EditHelper } from '../editors/EditHelper'
import { Select } from '../editors/Select'
import { Stacking } from '../components/Stacking'
import { Hooks } from '../components/Hooks'
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

export type IHook = (g: IGenerator) => void

export interface ICreate {
  name: string
  g: IGenerator
  dataLayout: IDataLayout
  index?: number
  count?: number
}

export type Create = (args: ICreate) => Block | undefined

/**
 * This is the interface for a low level generator. By conforming to it the
 * a custom Generator could replace the builtin Generator.
 */
export interface IGenerator {
  /**
   * Name of the generator.
   */
  name: () => string
  /**
   * Returns the [params](classes/params.html) that used with this Generator.
   */
  params: () => Params
  /**
   * Returns the [Blocks](classes/blocks.html) manager for this Generator.
   */
  blocks: () => Blocks
  /**
   * This component provides methods to manipulate the [stacking](classes/stacking.html)
   * order within a layer.
   */
  stacking: () => Stacking
  /**
   * Reset invokes the [init function](globase.html#init) in a Generator. It is called at the
   * beginning of each render. It will also call any defined [hook functions](classes/generator.html#hooks)
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
   * This will return the [Hooks](classes/hooks.html) for this generator. A Hook is a function that
   * is called each time reset is called at the beginning of each render. One use a Hook
   * to perform animation on a layer. See [rollHook](globals.html#rollHook) as a an example.
   */
  hooks: () => Hooks
  /**
   * This is function that is called in a generator to create a new Block. It is an optional
   * function.
   */
  create?: Create
  /**
   * [EditHelper](../classes/edithelper.html) is used to sync builtin edit commands with a custom Editor.
   */
  editor?: () => EditHelper | undefined
  /**
   *
   */
  containersize: (size?: ISize) => ISize
}

export class Generator implements IGenerator {
  private _name: string
  private _editHelper: EditHelper | undefined
  private _params: Params
  private _blocks: Blocks
  private _stacking: Stacking
  private _select: Select
  private _init: IInit
  private _hooks: Hooks
  private _create: Create | undefined
  private _containersize: ISize

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

  public select = (): Select => {
    return this._select
  }

  public lookup = (name: string): Block | undefined => {
    return this._blocks.get(name)
  }

  public hooks() {
    return this._hooks
  }

  public containersize(size?: ISize) {
    if (size) {
      this._containersize = size
    }
    if (this._containersize === undefined) {
      this._containersize = { width: 0, height: 0 }
    }
    return this._containersize
  }

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
