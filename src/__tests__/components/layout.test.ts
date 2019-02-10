import {
  convertInputBlockRect,
  layout,
  IRLGBounds
} from '../../components/layout'

import { IInputRect, IBlockRect } from '../../components/Block'
import { Unit } from '../../types'

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
    heightUnit: Unit.u
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
    leftUnit: Unit.u,
    top: 0,
    width: 100,
    height: 100,
    heightUnit: Unit.u
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
    bottom: 0.01,
    bottomUnit: Unit.vmax
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

it('layout #4', () => {
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
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
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
    left: 10,
    top: 0,
    right: 0,
    bottom: 0.01,
    bottomUnit: Unit.vmax
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 90,
    height: 90
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
    heightUnit: Unit.u
  }
  expect(layout(arg, bounds)).toEqual({
    x: 10,
    y: 0,
    width: 100,
    height: 100
  })
})
