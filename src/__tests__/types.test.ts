import {
  namedPositionRef,
  PositionRef,
  rectPoint,
  rectSize,
  Unit,
  isSuperset,
  union,
  intersection,
  symmetricDifference,
  difference
} from '../types'

import { namedUnit, toUnit } from '../components/blockUtils'

it('stringToUnit return correct value', () => {
  expect(toUnit('45px')).toEqual(Unit.pixel)
  expect(toUnit('50%')).toEqual(Unit.percent)
  expect(toUnit('40%vmin')).toEqual(Unit.vmin)
  expect(toUnit('30%vw')).toEqual(Unit.vw)
  expect(toUnit('1%vh')).toEqual(Unit.vh)
  expect(toUnit('50u')).toEqual(Unit.unmanaged)
})

it('namedUnit return correct value', () => {
  expect(namedUnit(Unit.pixel) === 'pixel')
  expect(namedUnit(Unit.percent) === 'percent')
  expect(namedUnit(Unit.vmin) === 'vmin')
  expect(namedUnit(Unit.vmax) === 'vmax')
  expect(namedUnit(Unit.vw) === 'vw')
  expect(namedUnit(Unit.vh) === 'vh')
  expect(namedUnit(Unit.unmanaged) === 'unmanaged')
})

it('namedPositionRef return correct value', () => {
  expect(namedPositionRef(PositionRef.bottom) === 'bottom')
  expect(namedPositionRef(PositionRef.left) === 'left')
  expect(namedPositionRef(PositionRef.leftBottom) === 'leftBottom')
  expect(namedPositionRef(PositionRef.leftTop) === 'leftTop')
  expect(namedPositionRef(PositionRef.none) === 'unknown')
  expect(namedPositionRef(PositionRef.position) === 'position')
  expect(namedPositionRef(PositionRef.right) === 'right')
  expect(namedPositionRef(PositionRef.rightBottom) === 'rightBottom')
  expect(namedPositionRef(PositionRef.rightTop) === 'rightTop')
  expect(namedPositionRef(PositionRef.top) === 'top')
})

it('return size of rect', () => {
  expect(rectSize({ x: 1, y: 2, width: 3, height: 4 })).toEqual({
    width: 3,
    height: 4
  })
})

it('return location of rect', () => {
  expect(rectPoint({ x: 1, y: 2, width: 3, height: 4 })).toEqual({ x: 1, y: 2 })
})

it('Set difference #1', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(difference(one, two)).toEqual(new Set([2]))
})

it('Set difference #2', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(difference(two, one)).toEqual(new Set())
})

it('Set difference #3', () => {
  const one = new Set([1, 3])
  const two = new Set([2])

  expect(difference(one, two)).toEqual(new Set([1, 3]))
})

it('Set difference #4', () => {
  const two = new Set([1, 3])
  const one = new Set([2])

  expect(difference(one, two)).toEqual(new Set([2]))
})

it('Set symmetricDifference #1', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(symmetricDifference(one, two)).toEqual(new Set([2]))
})

it('Set symmetricDifference #2', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(symmetricDifference(two, one)).toEqual(new Set([2]))
})

it('Set intersection #1', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(intersection(one, two)).toEqual(new Set([1, 3]))
})

it('Set intersection #2', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(intersection(two, one)).toEqual(new Set([1, 3]))
})

it('Set union #1', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(union(one, two)).toEqual(new Set([1, 2, 3]))
})

it('Set union #2', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(union(two, one)).toEqual(new Set([1, 2, 3]))
})

it('Set isSuperset #1', () => {
  const one = new Set([1, 2, 3])
  const two = new Set([1, 3])

  expect(isSuperset(one, two)).toEqual(true)
})
