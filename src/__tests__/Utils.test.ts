import { IPoint, Unit, ISize } from '../types'
import { toPixel, toPercent, clone } from '../utils'

const containersize = { width: 1000, height: 500 }

it('clone #1', () => {
  const x = { x: 100, y: 100 }
  expect(clone(x)).toEqual({ x: 100, y: 100 })
})

it('clone #2', () => {
  expect(clone(undefined)).toEqual(undefined)
})

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

it('convert toPixel #6', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.unmanaged },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

it('convert toPixel #7', () => {
  const p = toPixel(
    { value: { x: 50, y: 50 }, unit: Unit.pixel },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

it('convert toPercent #1', () => {
  const p = toPercent(
    { value: { x: 50, y: 50 }, unit: Unit.percent },
    containersize
  ) as IPoint
  expect(p.x + p.y).toEqual(100)
})

it('convert toPercent #2', () => {
  const p = toPercent(
    { value: { x: 50, y: 50 }, unit: Unit.preserve },
    containersize
  ) as IPoint
  expect(p.x + p.y).toEqual(100)
})

it('convert toPercent #3', () => {
  const p = toPercent(
    { value: { x: 50, y: 50 }, unit: Unit.preserve },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

it('convert toPercent #4', () => {
  const p = toPercent(
    { value: { x: 50, y: 50 }, unit: Unit.preserveHeight },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

it('convert toPercent #5', () => {
  const p = toPercent(
    { value: { x: 50, y: 50 }, unit: Unit.preserveWidth },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

it('convert toPercent #6', () => {
  const p = toPercent(
    { value: { x: 500, y: 250 }, unit: Unit.pixel },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

it('convert toPercent #6', () => {
  const p = toPercent(
    { value: { x: 500, y: 250 }, unit: Unit.unmanaged },
    containersize
  ) as IPoint
  expect(p).toEqual({ x: 50, y: 50 })
})

//

it('convert toPixel size #1', () => {
  const p = toPixel(
    { value: { width: 50, height: 50 }, unit: Unit.percent },
    containersize
  ) as ISize
  expect(p.width + p.height).toEqual(750)
})

it('convert toPixel size #2', () => {
  const p = toPixel(
    { value: { width: 50, height: 50 }, unit: Unit.preserve },
    containersize
  ) as ISize
  expect(p.width + p.height).toEqual(500)
})

it('convert toPixel size #3', () => {
  const p = toPixel(
    { value: { width: 50, height: 50 }, unit: Unit.preserve },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 250, height: 250 })
})

it('convert toPixel size #4', () => {
  const p = toPixel(
    { value: { width: 50, height: 50 }, unit: Unit.preserveHeight },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 250, height: 250 })
})

it('convert toPixel size #5', () => {
  const p = toPixel(
    { value: { width: 50, height: 50 }, unit: Unit.preserveWidth },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 500, height: 500 })
})

it('convert toPixel size #6', () => {
  const p = toPixel(
    { value: { width: 50, height: 50 }, unit: Unit.unmanaged },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 50, height: 50 })
})

it('convert toPercent size #1', () => {
  const p = toPercent(
    { value: { width: 50, height: 50 }, unit: Unit.percent },
    containersize
  ) as ISize
  expect(p.width + p.height).toEqual(100)
})

it('convert toPercent size #2', () => {
  const p = toPercent(
    { value: { width: 50, height: 50 }, unit: Unit.preserve },
    containersize
  ) as ISize
  expect(p.width + p.height).toEqual(100)
})

it('convert toPercent size #3', () => {
  const p = toPercent(
    { value: { width: 50, height: 50 }, unit: Unit.preserve },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 50, height: 50 })
})

it('convert toPercent size #4', () => {
  const p = toPercent(
    { value: { width: 50, height: 50 }, unit: Unit.preserveHeight },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 50, height: 50 })
})

it('convert toPercent size #5', () => {
  const p = toPercent(
    { value: { width: 50, height: 50 }, unit: Unit.preserveWidth },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 50, height: 50 })
})

it('convert toPercent size #6', () => {
  const p = toPercent(
    { value: { width: 500, height: 250 }, unit: Unit.pixel },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 50, height: 50 })
})

it('convert toPercent size #7', () => {
  const p = toPercent(
    { value: { width: 500, height: 250 }, unit: Unit.unmanaged },
    containersize
  ) as ISize
  expect(p).toEqual({ width: 50, height: 50 })
})
