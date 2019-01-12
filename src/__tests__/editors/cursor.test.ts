import { cursor } from '../../editors/cursor'
import { PositionRef } from '../../types'

it('stringToUnit return correct value', () => {
  expect(cursor(PositionRef.none)).toEqual('move')
  expect(cursor(PositionRef.position)).toEqual('move')
  expect(cursor(PositionRef.top)).toEqual('n-resize')
  expect(cursor(PositionRef.bottom)).toEqual('n-resize')
  expect(cursor(PositionRef.left)).toEqual('w-resize')
  expect(cursor(PositionRef.right)).toEqual('w-resize')
  expect(cursor(PositionRef.leftTop)).toEqual('nw-resize')
  expect(cursor(PositionRef.rightTop)).toEqual('ne-resize')
  expect(cursor(PositionRef.leftBottom)).toEqual('ne-resize')
  expect(cursor(PositionRef.rightBottom)).toEqual('nw-resize')

  expect(cursor(-1 as PositionRef)).toEqual('move')
})
