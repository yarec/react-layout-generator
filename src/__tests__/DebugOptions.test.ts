import { DebugOptions } from '../types'

it('DebugOption.errorAll includes none', () => {
  // tslint:disable-next-line:no-bitwise
  expect(DebugOptions.errorAll & DebugOptions.none).toEqual(DebugOptions.none)
})

it('DebugOption.errorAll includes warning', () => {
  // tslint:disable-next-line:no-bitwise
  expect(DebugOptions.errorAll & DebugOptions.warning).toEqual(
    DebugOptions.warning
  )
})

it('DebugOption.errorAll includes info', () => {
  // tslint:disable-next-line:no-bitwise
  expect(DebugOptions.errorAll & DebugOptions.info).toEqual(DebugOptions.info)
})

it('DebugOption.error does not include info', () => {
  // tslint:disable-next-line:no-bitwise
  expect(DebugOptions.error & DebugOptions.info).toEqual(DebugOptions.none)
})
