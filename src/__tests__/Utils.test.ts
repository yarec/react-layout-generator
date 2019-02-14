import { Unit } from '../types'
import { clone } from '../utils'
import { toXPixel, toYPixel, IRLGBounds } from '../components/blockUtils'

const containersize = { width: 100, height: 100 }
const viewport = { width: 1000, height: 500 }

const bounds: IRLGBounds = {
  container: containersize,
  viewport
}

it('clone #1', () => {
  const x = { x: 100, y: 100 }
  expect(clone(x)).toEqual({ x: 100, y: 100 })
})

it('clone #2', () => {
  expect(clone(undefined)).toEqual(undefined)
})

it('convert toXPixel #1', () => {
  const x = toXPixel(0.5, Unit.percent, bounds)
  expect(x).toEqual(50)
})

it('convert toXPixel #2', () => {
  const y = toXPixel(0.5, Unit.pmin, bounds)
  expect(y).toEqual(50)
})

it('convert toXPixel #3', () => {
  const y = toXPixel(0.5, Unit.pw, bounds)
  expect(y).toEqual(50)
})

it('convert toXPixel #4', () => {
  const y = toXPixel(0.5, Unit.ph, bounds)
  expect(y).toEqual(50)
})

it('convert toXPixel #5', () => {
  const y = toXPixel(0.5, Unit.pmax, bounds)
  expect(y).toEqual(50)
})

it('convert toXPixel #6', () => {
  const y = toYPixel(0.5, Unit.vmin, bounds)
  expect(y).toEqual(250)
})

it('convert toXPixel #7', () => {
  const y = toYPixel(0.5, Unit.vmax, bounds)
  expect(y).toEqual(500)
})

it('convert toXPixel #8', () => {
  const y = toYPixel(0.5, Unit.vw, bounds)
  expect(y).toEqual(500)
})

it('convert toXPixel #9', () => {
  const y = toYPixel(0.5, Unit.vh, bounds)
  expect(y).toEqual(250)
})

it('convert toYPixel #1', () => {
  const y = toYPixel(0.5, Unit.percent, bounds)
  expect(y).toEqual(50)
})
it('convert toYPixel #2', () => {
  const y = toYPixel(0.5, Unit.pw, bounds)
  expect(y).toEqual(50)
})

it('convert toYPixel #3', () => {
  const y = toYPixel(0.5, Unit.ph, bounds)
  expect(y).toEqual(50)
})

it('convert toYPixel #4', () => {
  const y = toYPixel(0.5, Unit.pmin, bounds)
  expect(y).toEqual(50)
})

it('convert toYPixel #5', () => {
  const y = toYPixel(0.5, Unit.pmax, bounds)
  expect(y).toEqual(50)
})

it('convert toYPixel #6', () => {
  const y = toYPixel(0.5, Unit.vmin, bounds)
  expect(y).toEqual(250)
})

it('convert toYPixel #7', () => {
  const y = toYPixel(0.5, Unit.vmax, bounds)
  expect(y).toEqual(500)
})

it('convert toYPixel #8', () => {
  const y = toYPixel(0.5, Unit.vw, bounds)
  expect(y).toEqual(500)
})

it('convert toYPixel #9', () => {
  const y = toYPixel(0.5, Unit.vh, bounds)
  expect(y).toEqual(250)
})
