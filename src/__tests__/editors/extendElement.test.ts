import { getExtendElement } from '../../editors/extendElement'

import { PositionRef } from '../../types'

it('extendElement PositionRef.', () => {
  const f = getExtendElement(PositionRef.position)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, 10, 10)).toEqual({
    x: 10,
    y: 10,
    width: 100,
    height: 100
  })
})

it('extendElement PositionRef.right', () => {
  const f = getExtendElement(PositionRef.right)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, 10, 10)).toEqual({
    x: 0,
    y: 0,
    width: 110,
    height: 100
  })
})

it('extendElement PositionRef.rightBottom', () => {
  const f = getExtendElement(PositionRef.rightBottom)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, 10, 10)).toEqual({
    x: 0,
    y: 0,
    width: 110,
    height: 110
  })
})

it('extendElement PositionRef.bottom', () => {
  const f = getExtendElement(PositionRef.bottom)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, 10, 10)).toEqual({
    x: 0,
    y: 0,
    width: 100,
    height: 110
  })
})

it('extendElement PositionRef.leftBottom', () => {
  const f = getExtendElement(PositionRef.leftBottom)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, -10, 10)).toEqual({
    x: -10,
    y: 0,
    width: 110,
    height: 110
  })
})

it('extendElement PositionRef.left', () => {
  const f = getExtendElement(PositionRef.left)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, -10, 10)).toEqual({
    x: -10,
    y: 0,
    width: 110,
    height: 100
  })
})

it('extendElement PositionRef.leftTop', () => {
  const f = getExtendElement(PositionRef.leftTop)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, -10, -10)).toEqual({
    x: -10,
    y: -10,
    width: 110,
    height: 110
  })
})

it('extendElement PositionRef.top', () => {
  const f = getExtendElement(PositionRef.top)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, -10, -10)).toEqual({
    x: 0,
    y: -10,
    width: 100,
    height: 110
  })
})

it('extendElement PositionRef.rightTop', () => {
  const f = getExtendElement(PositionRef.rightTop)
  expect(f({ x: 0, y: 0, width: 100, height: 100 }, 10, -10)).toEqual({
    x: 0,
    y: -10,
    width: 110,
    height: 110
  })
})
