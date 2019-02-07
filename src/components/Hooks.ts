import { IGenerator } from '../generators/Generator'

/**
 * The Hook type is a function with signature (g: IGenerator) => void.
 */
export type fnHook = (g: IGenerator) => void

export class Hooks {
  private _hooks: Map<string, fnHook> = new Map()

  public set(name: string, hook: fnHook) {
    this._hooks.set(name, hook)
  }

  public get(name: string) {
    return this._hooks.get(name)
  }

  public remove(name: string) {
    return this._hooks.delete(name)
  }

  public run(g: IGenerator) {
    this._hooks.forEach(hook => {
      hook(g)
    })
  }
}
