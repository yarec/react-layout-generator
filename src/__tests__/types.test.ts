import {
  namedUnit,
  namedPositionRef,
  PositionRef,
  rectPoint,
  rectSize,
  stringToUnit,
  Unit
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
