import { ParamValue } from '../components/Params'

/**
 * Layers
 */

export function flowLayoutLayer(zIndex: number) {
  return zIndex
}

/**
 * Store params in localStorage
 */

// Load key value
export function loadFromLocalStorage(prefix: string, key: string) {
  const v: string | null = localStorage.getItem(prefix + '.' + key)
  if (v) {
    return JSON.parse(v)
  }
  return undefined
}

// Save key value
export function saveToLocalStorage(
  prefix: string,
  key: string,
  value: ParamValue
) {
  localStorage.setItem(prefix + '.' + key, JSON.stringify(value))
}
