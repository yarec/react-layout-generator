import { Unit } from '../types'
import { clone } from '../utils'
import { toXPixel, toYPixel, IRLGBounds } from '../components/blockUtils'

const containersize = { width: 1000, height: 500 }
const viewport = { width: 1000, height: 500 }

const bounds: IRLGBounds = {
  local: containersize,
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
  expect(x).toEqual(500)
})

it('convert toYPixel #1', () => {
  const y = toYPixel(0.5, Unit.percent, bounds)
  expect(y).toEqual(250)
})

// it('convert toPixel #2', () => {
//   const p = toPixel(
//     { value: { x: 50, y: 50 }, unit: Unit.vmin },
//     containersize
//   ) as IPoint
//   expect(p.x + p.y).toEqual(500)
// })

// it('convert toPixel #3', () => {
//   const p = toPixel(
//     { value: { x: 50, y: 50 }, unit: Unit.vmin },
//     containersize
//   ) as IPoint
//   expect(p).toEqual({ x: 250, y: 250 })
// })

// it('convert toPixel #4', () => {
//   const p = toPixel(
//     { value: { x: 50, y: 50 }, unit: Unit.vh },
//     containersize
//   ) as IPoint
//   expect(p).toEqual({ x: 250, y: 250 })
// })

// it('convert toPixel #5', () => {
//   const p = toPixel(
//     { value: { x: 50, y: 50 }, unit: Unit.vw },
//     containersize
//   ) as IPoint
//   expect(p).toEqual({ x: 500, y: 500 })
// })

// it('convert toPixel #6', () => {
//   const p = toPixel(
//     { value: { x: 50, y: 50 }, unit: Unit.unmanaged },
//     containersize
//   ) as IPoint
//   expect(p).toEqual({ x: 50, y: 50 })
// })

// it('convert toPixel #7', () => {
//   const p = toPixel(
//     { value: { x: 50, y: 50 }, unit: Unit.pixel },
//     containersize
//   ) as IPoint
//   expect(p).toEqual({ x: 50, y: 50 })
// })
