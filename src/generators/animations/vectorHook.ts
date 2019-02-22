import { Block } from '../../components/Block'
import { IGenerator } from '../Generator'
import { IPoint, IOrigin, ISize } from '../../types'
import { fnHook } from '../../components/Hooks'
// import { fromOrigin } from '../../components/blockUtils'
import { createExPoint, IExPoint } from '../../geometry/point'
import { createLine } from '../../geometry/line'
import { createPiecewise } from '../../geometry/piecewise'

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
 * @params prefix -
 *  Prefix is used to specify unique keys in Params. This can be used
 *  for persisting state in [[Params]] by using prefix to make the key
 *  unique. e.g., `${prefix}someName`.
 * @params layer -
 *  Specifies the number of the layer.
 * @params velocity -
 *  Velocity is the speed of the animation in pixels per second.
 * @params handle -
 *  Handle is a point within the block that the vector will pass through.
 *  Note that it is the starting point for distributing the blocks on the vector.
 * @params placement -
 *  Placement is where each block will be [placed](interfaces/iorigin.html).
 *  To center the placement use {x: .5, y: .5}.
 * @params spacing -
 *  Spacing the distance between centered blocks on the vector.
 */
export interface IVectorHook {
  prefix: string
  points: IExPoint[]
  layer: number
  velocity: IPoint
  handle: IOrigin
  placement: IOrigin
  spacing: number
  g: IGenerator
}

export function vectorHook(args: IVectorHook): fnHook {
  args.g.params().set(`${args.prefix}init`, 0)

  const Piecewise = createPiecewise(args.g)
  // type Piecewise = InstanceType<typeof Piecewise>

  const Line = createLine(args.g)
  type Line = InstanceType<typeof Line>

  const ExPoint = createExPoint(args.g)
  //type ExPoint = InstanceType<typeof ExPoint>

  // Define path
  const lines = []
  for (let i = 1; i < args.points.length; i++) {
    const line = new Line(
      new ExPoint(args.points[i - 1]),
      new ExPoint(args.points[i])
    )
    lines.push(line)
  }

  const vel = Math.sqrt(
    Math.pow(args.velocity.x, 2) + Math.pow(args.velocity.y, 2)
  )
  const piecewise = new Piecewise(lines, true)

  let list: Block[] = []

  return function hook(g: IGenerator) {
    const params = g.params()
    const blocks = g.blocks()

    const deltaTime = params.get('deltaTime') as number
    const animate = params.get('animate') as number
    const containersize = params.get('containersize') as ISize
    const init = params.get(`${args.prefix}init`)

    if (containersize.width === 0 || containersize.height === 0) {
      return
    }

    // Block placement
    if (!init || list.length === 0) {
      // One time initialization
      list = blocks.layers(args.layer)
      // Place blocks on the line piecewise
      let offset = 0
      list.forEach(block => {
        const r = block.blockRect
        const p = piecewise.point(offset)
        if (p) {
          block.setData('animateDistance', offset)
          r.left = p.x
          r.top = p.y
          block.touch()
          // block.update(fromOrigin(r, args.placement))
          offset += args.spacing
        }
      })
      params.set(`${args.prefix}init`, 1)
    }

    // Animation
    if (animate && piecewise) {
      // animate
      list.forEach(block => {
        const r = block.blockRect
        const d = block.getData('animateDistance') as number
        if (d !== undefined) {
          const dv = d + deltaTime * vel
          block.setData('animateDistance', dv)
          const p = piecewise.point(dv)
          if (p) {
            r.left = p.x
            r.top = p.y
            block.touch()
          }
        }
      })
    }
  }
}
