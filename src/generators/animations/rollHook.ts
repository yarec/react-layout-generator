import { Block } from '../../components/Block'
// import { Params, ParamValue } from '../../components/Params'
import { IGenerator } from '../Generator'
import { IPoint, ISize } from '../../types'
import { fnHook } from '../../components/Hooks'
import { ParamValue } from '../../components/Params'

type Values = {
  [key: string]: ParamValue
}

/**
 * This is an optional hook that can be used to animate a level in Blocks.
 *
 * The prefix is used to make keys unique in Params. The initialValues is an object
 * with params that will be made available to the hook.
 *
 * @param prefix: string
 * @param initialValues: Values
 * @param g: IGenerator
 */
export function rollHook(
  prefix: string,
  initialValues: Values,
  g: IGenerator
): fnHook {
  const frameWidthKey = `${prefix}frameWidth`
  const frameHeightKey = `${prefix}frameHeight`

  const _params = g.params()
  _params.set(frameWidthKey, 0)
  _params.set(frameHeightKey, 0)

  const velocity: IPoint = (initialValues['velocity'] as IPoint)
    ? (initialValues['velocity'] as IPoint)
    : { x: 0.01, y: 0 }
  const layer: number = (initialValues['layer'] as number)
    ? (initialValues['velocity'] as number)
    : 2

  return function hook(g: IGenerator) {
    const params = g.params()
    const blocks = g.blocks()

    const deltaTime = params.get('deltaTime') as number
    const animate = params.get('animate') as number
    // const update = params.get('update') as number
    let containersize = params.get('containersize') as ISize

    const layer0 = blocks.layers(layer)
    if (params.changed()) {
      layer0.forEach((block: Block) => {
        block.touch()
      })
    }

    if (containersize.width && containersize.height) {
      let frameWidth = params.get(frameWidthKey) as number
      let frameHeight = params.get(frameHeightKey) as number

      let minX = Number.MAX_SAFE_INTEGER
      let minY = Number.MAX_SAFE_INTEGER
      let maxX = Number.MIN_SAFE_INTEGER
      let maxY = Number.MIN_SAFE_INTEGER
      layer0.forEach((block: Block) => {
        const rect = block.rect()
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
      frameWidth = Math.max(containersize.width, maxX - minX)
      frameHeight = Math.max(containersize.height, maxY - minY)
      params.set(frameWidthKey, frameWidth)
      params.set(frameHeightKey, frameHeight)

      if (animate) {
        layer0.forEach((block: Block) => {
          const rect = block.rect()
          let location = {
            x: rect.x - velocity.x * deltaTime,
            y: rect.y - velocity.y * deltaTime
          }

          // Wrap as needed
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

          block.update(location, { width: rect.width, height: rect.height })
        })
      }
    }
  }
}
