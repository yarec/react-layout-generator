import { Block } from '../../components/Block'
import { IGenerator } from '../Generator'
import { IPoint, ISize, IOrigin } from '../../types'
import { fnHook } from '../../components/Hooks'
import { fromOrigin } from '../../components/blockUtils'

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
 * @params Velocity is the speed of the animation in pixels per second.
 * @params Handle is a point within the block that the vector will pass through.
 * Note that it is the starting point for distributing the blocks on the vector.
 * @params Placement is where each block will be placed. To center the placement use
 * {x: .5, y: .5}.
 * @params Spacing the distance between centered blocks on the vector.
 */
export interface IVectorHook {
  prefix: string
  layer: number
  velocity: IPoint
  handle: IOrigin
  placement: IOrigin
  spacing: number
  g: IGenerator
}

export function vectorHook(args: IVectorHook): fnHook {
  args.g.params().set(`${args.prefix}init`, 0)

  const m = Math.sqrt(
    Math.pow(args.velocity.x, 2) + Math.pow(args.velocity.y, 2)
  )

  function xL(d: number, size: ISize) {
    const px = args.handle.x * size.width
    return px + (d * args.velocity.x) / m
  }

  function yL(d: number, size: ISize) {
    const py = args.handle.y * size.height
    return py + (d * args.velocity.y) / m
  }

  // function deltaX(d: number, size: ISize) {
  //   const px = args.handle.x * size.width
  //   return px + d * args.velocity.x/m
  // }

  // function deltaY(d: number, size: ISize) {
  //   const py = args.handle.y * size.height
  //   return py + d * args.velocity.y/m
  // }

  // const v = Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)
  // const deltaVelocity = Math.sqrt(v)

  return function hook(g: IGenerator) {
    const params = g.params()
    const blocks = g.blocks()

    // const deltaTime = params.get('deltaTime') as number
    // const animate = params.get('animate') as number
    const containersize = params.get('containersize') as ISize
    const init = params.get(`${args.prefix}init`)

    let list: Block[] = blocks.layers(args.layer)
    if (!init && list.length) {
      // One time initialization
      list = blocks.layers(args.layer)
      // Distribute blocks on vector
      let offset = 0
      list.forEach(block => {
        const r = block.rect
        r.x = xL(offset, containersize)
        r.y = yL(offset, containersize)
        block.update(fromOrigin(r, args.placement))
        offset += args.spacing
      })
      params.set(`${args.prefix}init`, 1)
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
