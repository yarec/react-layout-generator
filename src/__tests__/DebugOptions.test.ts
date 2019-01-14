import { DebugOptions } from '../types'

it('DebugOption.error does not include info', () => {
  // tslint:disable-next-line:no-bitwise
  expect(DebugOptions.error & DebugOptions.info).toEqual(DebugOptions.none)
})
