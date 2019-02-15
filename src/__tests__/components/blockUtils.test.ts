import {
  convertInputBlockRect,
  layout,
  IRLGBounds,
  inverseLayout,
  inverseXUnit,
  inverseYUnit
} from '../../components/blockUtils'

import { IExRect, IBlockRect } from '../../components/blockTypes'
import { Unit } from '../../types'

// const containersize = { width: 1000, height: 500 }
// const viewport = { width: 1000, height: 500 }

// const bounds: IRLGBounds ={
//   container: containersize,
//   viewport
// }

it('convertPositionLocation #1', () => {
  const arg: IExRect = {
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
  const arg: IExRect = {
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
  const arg: IExRect = {
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
  const arg: IExRect = {
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
  const arg: IExRect = {
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

it('convertPositionLocation #6', () => {
  const arg: IExRect = {}
  expect(convertInputBlockRect(arg)).toEqual({})
})

it('layout #1', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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

it('layout #10', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    height: 50
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 50
  })
})

it('layout #11', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    bottom: 50
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 50
  })
})

it('layout #12', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {}
  expect(layout(arg, bounds)).toEqual({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  })
})

it('layout #13', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 100
  })
})

it('layout #14', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 0,
    y: 0,
    width: 90,
    height: 100
  })
})

it('layout #15', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    bottom: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 0,
    y: 0,
    width: 100,
    height: 90
  })
})

it('layout #15', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    top: 10,
    bottom: 10
  }
  expect(layout(arg, bounds)).toEqual({
    x: 0,
    y: 10,
    width: 100,
    height: 80
  })
})

it('layout #16', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10,
    bottom: 10,
    width: 30,
    height: 20
  }
  expect(layout(arg, bounds)).toEqual({
    x: 60,
    y: 70,
    width: 30,
    height: 20
  })
})

it('layout #17', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    width: 30,
    height: 20
  }
  expect(layout(arg, bounds)).toEqual({
    x: 0,
    y: 0,
    width: 30,
    height: 20
  })
})

it('layout #18', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    height: 20
  }
  expect(layout(arg, bounds)).toEqual({
    x: 0,
    y: 0,
    width: 100,
    height: 20
  })
})

it('layout #19', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 10,
    width: 0.2,
    widthUnit: Unit.percent,
    height: 0.2,
    heightUnit: Unit.percent
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 10,
    width: 20,
    height: 20
  })
})

it('inverseLayout #1', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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
    container: { width: 100, height: 100 },
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

it('inverseLayout #10', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    height: 50
  }

  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 50
  }

  expect(inverseLayout(r, arg, bounds)).toEqual(arg)

  const r2 = {
    x: 12,
    y: 0,
    width: 90,
    height: 50
  }

  const arg2: IBlockRect = {
    left: 12,
    height: 50
  }

  expect(inverseLayout(r2, arg, bounds)).toEqual(arg2)
})

it('inverseLayout #11', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    bottom: 50
  }

  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 50
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #12', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {}

  const r = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #13', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10
  }

  const r = {
    x: 10,
    y: 0,
    width: 90,
    height: 100
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #14', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10
  }

  const r = {
    x: 0,
    y: 0,
    width: 90,
    height: 100
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #15', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    bottom: 10
  }

  const r = {
    x: 0,
    y: 0,
    width: 100,
    height: 90
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #15', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    top: 10,
    bottom: 10
  }

  const r = {
    x: 0,
    y: 10,
    width: 100,
    height: 80
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #16', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    right: 10,
    bottom: 10,
    width: 30,
    height: 20
  }
  const r = {
    x: 60,
    y: 70,
    width: 30,
    height: 20
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #17', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    width: 30,
    height: 20
  }

  const r = {
    x: 0,
    y: 0,
    width: 30,
    height: 20
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #18', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    height: 20
  }

  const r = {
    x: 0,
    y: 0,
    width: 100,
    height: 20
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)
})

it('inverseLayout #19', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }
  const arg: IBlockRect = {
    left: 10,
    top: 10,
    width: 0.2,
    widthUnit: Unit.percent,
    height: 0.2,
    heightUnit: Unit.percent
  }
  const r = {
    x: 10,
    y: 10,
    width: 20,
    height: 20
  }
  expect(inverseLayout(r, arg, bounds)).toEqual(arg)

  const arg1: IBlockRect = {
    left: 10,
    top: 10,
    width: 0.21,
    widthUnit: Unit.percent,
    height: 0.21,
    heightUnit: Unit.percent
  }
  const r1 = {
    x: 10,
    y: 10,
    width: 21,
    height: 21
  }
  expect(inverseLayout(r1, arg, bounds)).toEqual(arg1)
})

it('inverseXUnit #1', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }

  expect(inverseXUnit(10, Unit.pixel, bounds)).toEqual(10)
  expect(inverseXUnit(10, Unit.percent, bounds)).toEqual(0.1)
  expect(inverseXUnit(10, Unit.vw, bounds)).toEqual(0.01)
  expect(inverseXUnit(10, Unit.vh, bounds)).toEqual(0.02)
  expect(inverseXUnit(10, Unit.ph, bounds)).toEqual(0.1)
  expect(inverseXUnit(10, Unit.pw, bounds)).toEqual(0.1)
})

it('inverseYUnit #1', () => {
  const bounds: IRLGBounds = {
    container: { width: 100, height: 100 },
    viewport: { width: 1000, height: 500 }
  }

  expect(inverseYUnit(10, Unit.pixel, bounds)).toEqual(10)
  expect(inverseYUnit(10, Unit.percent, bounds)).toEqual(0.1)
  expect(inverseYUnit(10, Unit.vw, bounds)).toEqual(0.01)
  expect(inverseYUnit(10, Unit.vh, bounds)).toEqual(0.02)
  expect(inverseYUnit(10, Unit.ph, bounds)).toEqual(0.1)
  expect(inverseYUnit(10, Unit.pw, bounds)).toEqual(0.1)
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
