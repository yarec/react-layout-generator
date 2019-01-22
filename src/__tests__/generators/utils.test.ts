import {
  loadFromLocalStorage,
  saveToLocalStorage
} from '../../generators/utils'

// Ugly...
// 1) In order window.localStorage to work you
// need to set document.origin to any value
// 2) Mock does not work. The following test uses
// live localStorage
Object.defineProperty(document, 'origin', {
  value: 1
})

it('Layers #1', () => {
  saveToLocalStorage('a', 'b', 1)

  const v = loadFromLocalStorage('a', 'b')
  expect(v).toBe(1)
})
