import { isEqual } from 'underscore'
import { DebugOptions, IAttrRect, IPoint, IRect, ISize } from '../types'

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
  | IEditableTextData
export type Save = (prefix: string, key: string, value: ParamValue) => void
export type Load = (prefix: string, key: string) => ParamValue | undefined

export interface IParamsProps {
  name: string
  initialValues?: Array<[string, ParamValue]>
  save?: Save
  load?: Load
  debug?: DebugOptions
}

export default class Params {
  private _map: Map<string, ParamValue>
  private _changeCount: number
  private _name: string
  private _save: Save | undefined
  private _load: Load | undefined
  private _debug: DebugOptions

  constructor(props: IParamsProps) {
    this._map = new Map([])
    this._name = props.name
    this._changeCount = 0
    this._save = props.save
    this._load = props.load
    this._debug = props.debug ? props.debug : DebugOptions.none

    if (props.initialValues) {
      this.restore('', props.initialValues)
    }
  }

  public restore(
    name: string,
    values: Array<[string, ParamValue]>,
    replace?: boolean
  ) {
    // tslint:disable-next-line:no-bitwise
    if (this._debug & DebugOptions.data) {
      values.forEach((value: [string, ParamValue]) => {
        console.log(`Params restore init values ${value[0]}`, value[1])
      })
    }

    if (replace) {
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

  get map() {
    return this._map
  }

  get save() {
    return this._save
  }

  set save(fn: Save | undefined) {
    this._save = fn
  }

  get load() {
    return this._load
  }

  set load(fn: Load | undefined) {
    this._load = fn
  }

  public changed(): boolean {
    const changed = this._changeCount
    this._changeCount = 0
    return changed !== 0
  }

  public touch() {
    this._changeCount += 1
  }

  public get(key: string, load?: boolean): ParamValue | undefined {
    if (load && this._load) {
      const v = this._load(this._name, key)
      if (v) {
        return v
      }
    }
    return this._map.get(key)
  }

  public set(key: string, v: ParamValue): boolean {
    const r: ParamValue | undefined = this._map.get(key)

    // Only set if changed
    if (r && !isEqual(v, r)) {
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
}
