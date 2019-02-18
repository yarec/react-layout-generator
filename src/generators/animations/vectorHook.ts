import { Block } from '../../components/Block'
import { IGenerator } from '../Generator'
import { IPoint, ISize, IOrigin } from '../../types'
import { fnHook } from '../../components/Hooks'

/**
 * This is an optional hook that can be used to animate a vector of blocks.
 * It will render as a an animation with the blocks in an infinite loop until
 * the animation is stopped. When a block is moved outside of the container
 * it will be placed at the beginning of the vector.
 *
 * The following is an example of a vertical vector with blocks distributed
 * on it. The center of each block is `spacing` distance from the previous
 * and following block. The velocity is {x: 0, y: .1} ~ 6 pixels per second
 * downward.
 * ```
 * container with handle set to {x: 50, y: 0}
 * ┌─────────────────x─────────────────┐
 * │                 │                 │
 * │               ┌─│─┐               │
 * │               │ │ │               │
 * │               └─│─┘               │
 * │                 │                 │
 * │               ┌─│─┐               │
 * │               │ │ │               │
 * │               └─│─┘               │
 * │                 ↓                 │
 * └───────────────────────────────────┘
 * ```
 *
 * @params Prefix is used to specify unique keys in Params. This can be used
 * for persisting state in [[Params]].
 * @params Layer is the mapped number of the layer.
 * @params Velocity is the speed of the animation in pixels per frame.
 * @params Handle is a point within the block that the vector will pass through.
 * Note that it is the starting point for distributing the blocks on the vector.
 * @params Spacing the distance between centered blocks on the vector.
 */
export function vectorHook(
  prefix: string,
  layer: number,
  velocity: IPoint,
  handle: IOrigin,
  spacing: number,
  g: IGenerator
): fnHook {
  g.params().set(`${prefix}init`, 0)

  function x(t: number, size: ISize) {
    return handle.x * size.width + t * velocity.x
  }

  function y(t: number, size: ISize) {
    return handle.y * size.height + t * velocity.y
  }

  // const v = Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)
  // const deltaVelocity = Math.sqrt(v)

  return function hook(g: IGenerator) {
    const params = g.params()
    const blocks = g.blocks()

    // const deltaTime = params.get('deltaTime') as number
    // const animate = params.get('animate') as number
    const containersize = params.get('containersize') as ISize
    const init = params.get(`${prefix}init`)

    let list: Block[] = blocks.layers(layer)
    if (!init && list.length) {
      list = blocks.layers(layer)
      // Distribute on vector
      let offset = 0
      list.forEach(block => {
        const r = block.rect
        r.x = x(offset, containersize)
        r.y = y(offset, containersize)
        block.update(r)
        offset += spacing
      })
      params.set(`${prefix}init`, 1)
    }

    // if (containersize.width && containersize.height) {
    //   if (animate) {
    //     list.forEach((block: Block) => {
    //       const r = block.rect
    //       const offset = Math.sqrt(r.x^2 + r.y^2) + deltaVelocity * deltaTime
    //       r.x += deltaTime * velocity.x
    //       r.y +=  deltaTime * velocity.y
    //       block.update(r)
    //     })
    //   }
    // }
  }
}
