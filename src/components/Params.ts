import { DebugOptions, IAttrRect, IPoint, IRect, ISize } from '../types'
import { IExRect } from './blockTypes'

const deepEqual = require('deep-equal')

export interface IEditableTextData {
  content: string
  font?: string
  fontSize?: number
  alpha?: number
}

export type ParamValue =
  | number
  | IPoint
  | ISize
  | IRect
  | IAttrRect
  | IExRect
  | IEditableTextData

export type Save = (prefix: string, key: string, value: ParamValue) => void
export type Load = (prefix: string, key: string) => ParamValue | undefined

export interface IParamsProps {
  /**
   * Name is required and should be unique if using save or load.
   */
  name: string
  /**
   * This is an array of [key, value] that will be used to initialize the params.
   * One use of this argument is to embed values in a distribution rather than
   * relying on a database.
   */
  initialValues?: Array<[string, ParamValue]>
  /**
   * Same as params.save.
   */
  save?: Save
  /**
   * Same as params.load.
   */
  load?: Load
  /**
   * Standard debug options.
   */
  debug?: DebugOptions
}

/**
 * This class is the persistent storage mechanism for [[Generator]]s. It
 * lets you set, get, and share data. To persist its data simply use the
 * save and load functions or use data to get an Array of [key, value]
 * that can be embedded in your distribution.
 */
export class Params {
  private _map: Map<string, ParamValue>
  private _changeCount: number
  private _name: string
  private _save: Save | undefined
  private _load: Load | undefined
  private _debug: DebugOptions

  constructor(args: IParamsProps) {
    this._map = new Map([])
    this._name = args.name
    this._changeCount = 0
    this._save = args.save
    this._load = args.load
    this._debug = args.debug ? args.debug : DebugOptions.none

    if (args.initialValues) {
      this.restore('', args.initialValues)
    }
  }

  /**
   * Save sets the save function that will be called internally to
   * set values in a database. For localStorage use the [[saveToLocalStorage]]
   * function.
   */
  set save(fn: Save | undefined) {
    this._save = fn
  }

  /**
   * Load sets the load function that will be called internally to
   * get values from a database. For localStorage use the [[loadFromLocalStorage]]
   * function.
   */
  set load(fn: Load | undefined) {
    this._load = fn
  }

  /**
   * Returns an array of [key, value] that can be used as an argument when
   * creating a new Params or when calling restore.
   */
  get data(): Array<[string, ParamValue]> {
    const data: Array<[string, ParamValue]> = []
    this._map.forEach((value, key) => {
      data.push([key, value])
    })

    return data
  }

  /**
   * Changed returns true if the params have been modified since the last call
   * to changed.
   */
  public changed(): boolean {
    const changed = this._changeCount
    this._changeCount = 0
    return changed !== 0
  }

  /**
   * Touch increments the change count.
   */
  public touch() {
    this._changeCount += 1
  }

  /**
   * Get returns the [value](globals.html#paramvalue) matching the key or
   * undefined if there is no entry for the key.
   *
   * If you are using typescript then you will need to cast the return value
   * to one of the allowed [param types](globals.html#paramvalue).
   */
  public get(key: string, load?: boolean): ParamValue | undefined {
    if (load && this._load) {
      const v = this._load(this._name, key)
      if (v) {
        return v
      }
    }
    return this._map.get(key)
  }

  /**
   * Set the [value](globals.html#paramvalue) at the key.
   */
  public set(key: string, v: ParamValue): boolean {
    const r: ParamValue | undefined = this._map.get(key)

    // Only set if changed
    if (r && !deepEqual(v, r)) {
      // console.log('Param.set ', key, v);
      this._changeCount += 1
      if (this._save) {
        this._save(this._name, key, v)
      }
      this._map.set(key, v)
      return true
    }

    if (!r) {
      // console.log('Param.set ', key);
      this._changeCount += 1
      if (this._save) {
        this._save(this._name, key, v)
      }
      this._map.set(key, v)
      return true
    }

    return false
  }

  /**
   * Allows [key, value] data to be restored after Params has been created.
   * @param name - If not empty, it should match the name of the Params.
   * @param values - An Array<[key, value]> values.
   * @param clear - If true then existing keys and values will be removed.
   * Be careful with this option.
   */
  public restore(
    name: string,
    values: Array<[string, ParamValue]>,
    clear?: boolean
  ) {
    // tslint:disable-next-line:no-bitwise
    if (this._debug & DebugOptions.data) {
      values.forEach((value: [string, ParamValue]) => {
        console.log(`Params restore init values ${value[0]}`, value[1])
      })
    }

    if (clear) {
      this._map.clear()
    }

    // 1) if params are empty then just insert the params

    if (this._map.size === 0) {
      if (this._load) {
        values.forEach((value: [string, ParamValue]) => {
          const v = this._load!(this._name, value[0])
          if (v) {
            // tslint:disable-next-line:no-bitwise
            if (this._debug & DebugOptions.data) {
              console.log(`Params restore from  localStorage ${value[0]}`, v)
            }
            this.set(value[0], v)
          } else {
            this.set(value[0], value[1])
          }
        })
      } else {
        values.forEach((value: [string, ParamValue]) => {
          this.set(value[0], value[1])
        })
      }

      return this
    }

    // 2) set any missing params

    values.forEach((value: [string, ParamValue]) => {
      const v = this._map.get(value[0])
      if (v === undefined) {
        this.set(value[0], value[1])
      }
    })

    return this
  }
}
