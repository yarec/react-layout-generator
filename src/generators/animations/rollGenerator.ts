import { Block } from '../../components/Block'
import { Blocks } from '../../components/Blocks'
import { Params, ParamValue } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../Generator'
import { ISize } from '../../types'

export function rollGenerator(name: string, exParams?: Params): IGenerator {
  const values: Array<[string, ParamValue]> = [
    ['containersize', { width: 0, height: 0 }],
    ['animationStart', 0],
    ['animationTime', 0],
    ['animationLast', 0]
  ]

  const _params = exParams
    ? exParams.restore(name, values)
    : new Params({
        name: 'movieCredits',
        initialValues: values
      })

  function init(g: IGenerator): Blocks {
    const params = g.params()
    const blocks = g.blocks()

    const update = params.get('update') as number

    const velocity = params.get('velocity') as number
    const deltaTime = params.get('deltaTime') as number
    const animate = params.get('animate') as number

    let containersize = params.get('containersize') as ISize

    if (params.changed()) {
      blocks.map.forEach((block: Block) => {
        block.touch()
      })
    }

    if (containersize.width && containersize.height) {
      let frameHeight = params.get('frameHeight') as number

      if (update === undefined || update) {
        let min = Number.MAX_SAFE_INTEGER
        let max = Number.MIN_SAFE_INTEGER
        blocks.map.forEach((block: Block) => {
          const rect = block.rect()
          if (rect.y < min) {
            min = rect.y
          }
          if (rect.y + rect.height > max) {
            max = rect.y + rect.height
          }
        })
        params.set('update', 0)
        frameHeight = max - min
        params.set('frameHeight', Math.max(containersize.height, frameHeight))
      }

      if (animate) {
        blocks.map.forEach((block: Block) => {
          const rect = block.rect()
          let location = { x: rect.x, y: rect.y - velocity * deltaTime }
          if (location.y + rect.height < 0) {
            location.y += frameHeight
          }
          block.update(location, { width: rect.width, height: rect.height })
        })
      }
    }

    return blocks
  }

  function create(args: ICreate): Block {
    if (!args.position) {
      console.error(`You need to pass a position (IPosition) object 
      for ${args.name} in generator ${args.g.name()}`)
    }

    args.g.params().set('update', 1)

    return args.g.blocks().set(args.name, args.position, args.g)
  }

  return new Generator(name, init, _params, create)
}
