import { Params, ParamValue } from '../../components/Params'
import { ISize, DebugOptions } from '../../types'

it('params #1', () => {
  const params = new Params({
    name: 'params #1',
    initialValues: [['containersize', { width: 1000, height: 1000 }]]
  })

  const size = params.get('containersize') as ISize
  expect(size).toEqual({ width: 1000, height: 1000 })
})

it('params #2', () => {
  const params = new Params({
    name: 'params #2',
    initialValues: [['containersize', { width: 1000, height: 1000 }]],
    debug: DebugOptions.all
  })

  const size = params.get('containersize') as ISize
  expect(size).toEqual({ width: 1000, height: 1000 })
})

it('params #3', () => {
  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['itemSize', { width: 0, height: 0 }]
  ]

  const params = new Params({
    name: 'params #3',
    initialValues: [['containersize', { width: 1000, height: 1000 }]],
    debug: DebugOptions.all
  })

  params.restore('', values)

  const size = params.get('containersize') as ISize
  expect(size).toEqual({ width: 1000, height: 1000 })
})

it('params #4', () => {
  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['itemSize', { width: 0, height: 0 }]
  ]

  const params = new Params({
    name: 'params #4',
    initialValues: [['containersize', { width: 1000, height: 1000 }]],
    debug: DebugOptions.all
  })

  params.restore('', values, true)

  const size = params.get('containersize') as ISize
  expect(size).toEqual({ width: 0, height: 0 })
})

it('params #5', () => {
  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['itemSize', { width: 0, height: 0 }]
  ]

  const params = new Params({
    name: 'params #5',
    initialValues: [['containersize', { width: 1000, height: 1000 }]],
    debug: DebugOptions.all
  })

  params.restore('#5', values, true)

  const size = params.get('containersize') as ISize
  expect(size).toEqual({ width: 0, height: 0 })

  size.width = 2
  params.set('containersize', size)

  const size2 = params.get('containersize') as ISize
  expect(size2).toEqual({ width: 2, height: 0 })
})
