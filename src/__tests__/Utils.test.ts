// import { loadFromLocalStorage, saveToLocalStorage } from '../generators/utils'
import { IPoint, Unit } from '../types'
import { toPixel } from '../utils'

const containersize = { width: 1000, height: 500 }

it('convert toPixel #1', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.percent },
    containersize
  ) as IPoint
  expect(p.x + p.y).toEqual(750)
})

it('convert toPixel #2', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.preserve },
    containersize
  ) as IPoint
  expect(p.x + p.y).toEqual(500)
})

it('convert toPixel #3', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.preserve },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 250, y: 250 })
})

it('convert toPixel #4', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.preserveHeight },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 250, y: 250 })
})

it('convert toPixel #5', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.preserveWidth },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 500, y: 500 })
})

// it('saves params to localStorage', () => {
//   saveToLocalStorage('test', 'param', { x: 0, y: 0 })
//   const v = loadFromLocalStorage('test', 'param')
//   expect(v).toEqual({ x: 0, y: 0 })
// })
