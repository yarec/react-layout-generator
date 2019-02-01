import {
  namedUnit,
  namedPositionRef,
  PositionRef,
  rectPoint,
  rectSize,
  stringToUnit,
  Unit,
  isSuperset,
  union,
  intersection,
  symmetricDifference,
  difference
} from '../types'

it('stringToUnit return correct value', () => {
  expect(stringToUnit('45px').toFixed(Unit.pixel)) // px
  expect(stringToUnit('50%').toFixed(Unit.percent)) // %
  expect(stringToUnit('40%p').toFixed(Unit.preserve)) // %p
  expect(stringToUnit('30%pw').toFixed(Unit.preserveWidth)) // %pw
  expect(stringToUnit('1%ph').toFixed(Unit.preserveHeight)) // %ph
  expect(stringToUnit('50a').toFixed(Unit.unmanaged)) // a
  expect(stringToUnit('50aw').toFixed(Unit.unmanagedWidth)) // aw
  expect(stringToUnit('50ah').toFixed(Unit.unmanagedHeight)) // ah
  expect(stringToUnit('50').toFixed(Unit.pixel))

  expect(stringToUnit('1%h').toFixed(Unit.pixel)) // %ph
  expect(stringToUnit('50w').toFixed(Unit.unmanagedHeight)) // ah
})

it('namedUnit return correct value', () => {
  expect(namedUnit(Unit.pixel) === 'pixel') // px
  expect(namedUnit(Unit.percent) === 'percent') // %
  expect(namedUnit(Unit.preserve) === 'preserve') // %p
  expect(namedUnit(Unit.preserveWidth) === 'preserveWidth') // %pw
  expect(namedUnit(Unit.preserveHeight) === 'preserveHeight') // %ph
  expect(namedUnit(Unit.unmanaged) === 'unmanaged') // a
  expect(namedUnit(Unit.unmanagedWidth) === 'unmanagedWidth') // aw
  expect(namedUnit(Unit.unmanagedHeight) === 'unmanagedHeight') // ah
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

  expect(isSuperset(two, one)).toEqual(true)
})
