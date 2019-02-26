import { Block } from '../../components/Block'
import { IGenerator } from '../Generator'
import { IOrigin, ISize } from '../../types'
import { fnHook } from '../../components/Hooks'
import { createExPoint, IExPoint } from '../../geometry/point'
import { createLine } from '../../geometry/line'
import { createPiecewise } from '../../geometry/piecewise'

// Parametric spline curves - http://www.doc.ic.ac.uk/~dfg/AndysSplineTutorial/Parametrics.html

/**
 * This is an optional hook that can be used to animate a list of blocks on
 * a path.
 *
 * It will render as a an animation moving the blocks along the path.
 *
 * The following is an example of a vertical path with blocks distributed
 * on it. The center of each block is `spacing` distance from the previous
 * and following block. The velocity is {x: 0, y: .1} ~ 6 pixels per second
 * downward.
 * ```
 * container with anchor set to {x: .50, y: .0}
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
 *  for saving state in [[Params]] by using prefix to make the key
 *  unique. e.g., `${prefix}someName`.
 * @params points -
 *  Array of pairs of points that define the path by connecting the
 *  points with a line. The path may be discontinuous or a step function.
 *  Derivatives need not exist through out the path.
 * @params input -
 *  Specifies the blocks to place along the path.
 * @params output -
 *  Location where the the blocks exiting the path are placed. This lets
 *  you chain pathHook
 * @params velocity -
 *  Velocity is the speed of the animation in pixels per frame on the path.
 * @params anchor -
 *  Anchor is a [point](interfaces/iorigin.html) that the path will pass through.
 * @params placement -
 *  Placement is where each block will be [placed](interfaces/iorigin.html).
 *  To center the placement use {x: .5, y: .5}.
 * @params spacing -
 *  Spacing the distance between blocks on the path.
 */
export interface IPathHook {
  prefix: string
  points: IExPoint[]
  input: () => Block[]
  output: Block[]
  velocity: number
  anchor: IOrigin
  active?: () => boolean
  complete?: () => boolean
  placement?: IOrigin
  infinite?: boolean
  spacing: number
  g: IGenerator
}

export function pathHook(args: IPathHook): fnHook {
  args.g.params().set(`${args.prefix}init`, 0)

  const Piecewise = createPiecewise(args.g)
  // type Piecewise = InstanceType<typeof Piecewise>

  const Line = createLine(args.g)
  type Line = InstanceType<typeof Line>

  const ExPoint = createExPoint(args.g)
  //type ExPoint = InstanceType<typeof ExPoint>

  // Define path
  const lines = []
  for (let i = 1; i < args.points.length; i += 2) {
    const line = new Line(
      new ExPoint(args.points[i - 1]),
      new ExPoint(args.points[i])
    )
    lines.push(line)
  }

  const piecewise = new Piecewise(lines)

  let list: Block[] = []

  // The hook
  return function hook(g: IGenerator) {
    const params = g.params()
    const deltaTime = params.get('deltaTime') as number
    const animate = params.get('animate') as number
    const containersize = params.get('containersize') as ISize
    const init = params.get(`${args.prefix}init`)

    if (containersize.width === 0 || containersize.height === 0) {
      return
    }

    // Block placement
    if (!init) {
      // console.log(`pathHook init ${deltaTime}`)
      // One time initialization
      list = args.input()
      // Place blocks
      let offset = 0
      for (let i = 0; i < list.length; i++) {
        const block = list[i]
        block.setData('distance', offset)
        // console.log(`pathHook init ${block.name} ${offset} `)
        offset -= args.spacing
      }
      params.set(`${args.prefix}init`, list.length)
    }

    // Animation
    if (animate && piecewise && deltaTime) {
      // Process list
      // 1) animate each block
      // 2) remove block if completed piecewise and not repeat
      // 3) update list
      const updatedList: Block[] = []

      // Get first block
      let block = list.shift()
      while (block) {
        const r = block.blockRect
        const d = block.getData('distance', 0) as number

        const dv = d + deltaTime * args.velocity
        block.setData('distance', dv)
        const p = piecewise.point(dv)

        // console.log(`pathHook ${block.name} ${d} ${p? p.x : 'undefined'}`)
        if (p) {
          // Point exists on piecewise
          r.left = p.x
          r.top = p.y
          block.touch()
          // Keep this block
          updatedList.push(block)
        } else {
          if (args.infinite) {
            // Its possible that d is < 0 - ignore
            if ((block.getData('distance', 0) as number) > 0) {
              block.setData('distance', 0)
            }
            // Keep block
            updatedList.push(block)
          } else {
            // Put on output - block finished
            args.output.unshift(block)
          }
        }
        // Get next block
        block = list.shift()
      }
      // Update list
      list = updatedList
    }
  }
}
