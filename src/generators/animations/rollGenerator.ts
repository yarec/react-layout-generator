import { Block } from '../../components/Block'
import { Blocks } from '../../components/Blocks'
import { Params, ParamValue } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../Generator'
import { ISize, IPoint } from '../../types'

export function rollGenerator(name: string, exParams?: Params): IGenerator {
  const values: Array<[string, ParamValue]> = [['animationLast', 0]]

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

    const velocity = params.get('velocity') as IPoint
    const deltaTime = params.get('deltaTime') as number
    const animate = params.get('animate') as number

    let containersize = params.get('containersize') as ISize

    const layer0 = blocks.layers(0)
    if (params.changed()) {
      layer0.forEach((block: Block) => {
        block.touch()
      })
    }

    if (containersize.width && containersize.height) {
      let frameWidth = params.get('frameWidth') as number
      let frameHeight = params.get('frameHeight') as number

      if (update === undefined || update) {
        let minX = Number.MAX_SAFE_INTEGER
        let minY = Number.MAX_SAFE_INTEGER
        let maxX = Number.MIN_SAFE_INTEGER
        let maxY = Number.MIN_SAFE_INTEGER
        layer0.forEach((block: Block) => {
          const rect = block.rect
          if (rect.x < minX) {
            minX = rect.x
          }
          if (rect.x + rect.width > maxX) {
            maxX = rect.x + rect.width
          }
          if (rect.y < minY) {
            minY = rect.y
          }
          if (rect.y + rect.height > maxY) {
            maxY = rect.y + rect.height
          }
        })
        params.set('update', 0)
        frameWidth = maxX - minX
        frameHeight = maxY - minY
        params.set('frameWidth', Math.max(containersize.width, frameWidth))
        params.set('frameHeight', Math.max(containersize.height, frameHeight))
      }

      if (animate) {
        layer0.forEach((block: Block) => {
          const rect = block.rect
          let location = {
            x: rect.x - velocity.x * deltaTime,
            y: rect.y - velocity.y * deltaTime,
            width: rect.width,
            height: rect.height
          }

          if (Math.sign(velocity.x) === 1) {
            if (location.x + rect.width < 0) {
              location.x += frameWidth
            }
          } else {
            if (location.x > containersize.width) {
              location.x -= frameWidth
            }
          }
          if (Math.sign(velocity.y) === 1) {
            if (location.y + rect.height < 0) {
              location.y += frameHeight
            }
          } else {
            if (location.y > containersize.height) {
              location.y -= frameHeight
            }
          }

          block.update(location)
        })
      }
    }

    return blocks
  }

  function create(args: ICreate): Block {
    args.g.params().set('update', 1)

    return args.g.blocks().set(args.name, args.dataLayout, args.g)
  }

  return new Generator(name, init, _params, create)
}
