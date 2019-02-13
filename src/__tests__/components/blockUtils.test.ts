import {
  convertInputBlockRect,
  layout,
  IRLGBounds,
  inverseLayout
} from '../../components/blockUtils'

import { IInputRect, IBlockRect } from '../../components/blockTypes'
import { Unit } from '../../types'

// const containersize = { width: 1000, height: 500 }
// const viewport = { width: 1000, height: 500 }

// const bounds: IRLGBounds ={
//   local: containersize,
//   viewport
// }

it('convertPositionLocation #1', () => {
  const arg: IInputRect = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
  expect(convertInputBlockRect(arg)).toEqual({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  })
})

it('convertPositionLocation #2', () => {
  const arg: IInputRect = {
    left: '10%',
    top: 0,
    right: 0,
    bottom: '10vmax'
  }
  expect(convertInputBlockRect(arg)).toEqual({
    left: 0.1,
    leftUnit: Unit.percent,
    top: 0,
    right: 0,
    bottom: 0.1,
    bottomUnit: Unit.vmax
  })
})

it('convertPositionLocation #3', () => {
  const arg: IInputRect = {
    left: '10.5%',
    top: 0,
    right: 0,
    bottom: '10.01vmax'
  }
  expect(convertInputBlockRect(arg)).toEqual({
    left: 0.105,
    leftUnit: Unit.percent,
    top: 0,
    right: 0,
    bottom: 0.1001,
    bottomUnit: Unit.vmax
  })
})

it('convertPositionLocation #4', () => {
  const arg: IInputRect = {
    left: '10.5%',
    top: 0,
    width: 100,
    height: '100u'
  }
  expect(convertInputBlockRect(arg)).toEqual({
    left: 0.105,
    leftUnit: Unit.percent,
    top: 0,
    width: 100,
    height: 100,
    heightUnit: Unit.unmanaged
  })
})

it('convertPositionLocation #5', () => {
  const arg: IInputRect = {
    left: '10.5u',
    top: 0,
    width: 100,
    height: '100u'
  }
  expect(convertInputBlockRect(arg)).toEqual({
    left: 10.5,
    leftUnit: Unit.unmanaged,
    top: 0,
    width: 100,
    height: 100,
    heightUnit: Unit.unmanaged
  })
})

it('layout #1', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 1000 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 90
  })
})

it('layout #2', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 1000 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.percent
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 99
  })
})

it('layout #3', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 1000 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    width: 50,
    bottom: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 50,
    height: 90
  })
})

it('layout #4', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 10,
    bottom: 0.01,
    bottomUnit: Unit.vh
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 80,
    height: 95
  })
})

it('layout #5', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.vw
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 90
  })
})

it('layout #6', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10,
    bottom: 10,
    width: 50,
    height: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 40,
    y: 80,
    width: 50,
    height: 10
  })
})

it('layout #7', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.vmin
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 95
  })
})

it('layout #8', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 100
  })
})

it('layout #9', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    width: 100,
    height: 100,
    heightUnit: Unit.unmanaged
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 100,
    height: 100
  })
})

it('inverseLayout #1', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 1000 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 10
  }
  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 90
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #2', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 1000 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.percent
  }
  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 99
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #3', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 1000 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    width: 50,
    bottom: 10
  }
  const r = {
    x: 10,
    y: 0,
    width: 50,
    height: 90
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #4', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.vh
  }
  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 95
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #5', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.vw
  }
  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 90
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #6', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10,
    bottom: 10,
    width: 50,
    height: 10
  }
  const r = {
    x: 40,
    y: 80,
    width: 50,
    height: 10
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #7', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.vmin
  }
  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 95
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #8', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10,
    bottom: 10,
    width: 50,
    height: 10
  }
  const r = {
    x: 40,
    y: 80,
    width: 50,
    height: 10
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #9', () => {
  const bounds: IRLGBounds = {
    local: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 0,
    width: 100,
    height: 100,
    heightUnit: Unit.unmanaged
  }
  const r = {
    x: 10,
    y: 0,
    width: 100,
    height: 100
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

// it('convert toPercent #1', () => {
//   const p = toPercent(
//     { x: 50, y: 50 }, Unit.percent,
//     bounds
//   )
//   expect(p.x + p.y).toEqual(100)
// })

// it('convert toPercent #2', () => {
//   const p = toPercent(
//     { x: 50, y: 50 },
//     Unit.vmin,
//     bounds
//   )
//   expect(p.x + p.y).toEqual(100)
// })

// it('convert toPercent #3', () => {
//   const p = toPercent(
//     { x: 50, y: 50 },
//     Unit.vmin,
//     bounds
//   )
//   expect(p).toEqual({ x: 50, y: 50 })
// })

// it('convert toPercent #4', () => {
//   const p = toPercent(
//     { x: 50, y: 50 },
//     Unit.vh,
//     bounds
//   )
//   expect(p).toEqual({ x: 50, y: 50 })
// })

// it('convert toPercent #5', () => {
//   const p = toPercent(
//    { x: 50, y: 50 },
//    Unit.vw,
//   bounds
//   )
//   expect(p).toEqual({ x: 50, y: 50 })
// })

// it('convert toPercent #6', () => {
//   const p = toPercent(
//     { x: 500, y: 250 },
//     Unit.pixel,
//     bounds
//   )
//   expect(p).toEqual({ x: 50, y: 50 })
// })

// it('convert toPercent #6', () => {
//   const p = toPercent(
//     { x: 500, y: 250 },
//     Unit.unmanaged,
//     bounds
//   )
//   expect(p).toEqual({ x: 50, y: 50 })
// })

// it('convert toPercent size #7', () => {
//   const p = toPercent(
//     { x: 500, y: 250 },
//     Unit.unmanaged,
//     bounds
//   )
//   expect(p).toEqual({ x: 50, y: 50 })
// })
