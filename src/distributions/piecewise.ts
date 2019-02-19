// import { IPoint } from '../types'
// import { ExPoint } from './pointUtils'
// import { IBounds } from '../components/blockUtils'

// export class Piecewise {
//   public start: ExPoint
//   public end: ExPoint
//   public cumulativeStart: number
//   public cumulativeEnd: number
//   public bounds: IBounds

//   constructor(start: ExPoint, end: ExPoint, bounds: IBounds) {
//     this.start = start
//     this.end = end
//     this.bounds = bounds
//   }

//   public length () {
//     const s = this.start.getPoint(this.bounds)
//     const e = this.end.getPoint(this.bounds)
//     return Math.sqrt(Math.pow(s.x - e.x, 2) + Math.pow(s.y - e.y, 2))
//   }

//   const m = Math.sqrt(Math.pow(args.velocity.x, 2) + Math.pow(args.velocity.y, 2))

//   private xL(d: number) {
//     const p = this.start.getPoint(this.bounds)
//     const px = this.start.getX(this.bounds) * this.bounds.container.width
//     return px + d * args.velocity.x/m
//   }

//   function yL(d: number, size: ISize) {
//     const py = args.handle.y * size.height
//     return py + d * args.velocity.y/m
//   }

//   public point(d: number): IPoint {
//     return {
//       x:
//     }
//   }

// }

// export function piecewiseGenerator(args: Piecewise[]) {
//   const piecewise: Piecewise[] = args
//   let cumulative = 0
//   piecewise.forEach(piece => {
//     piece.cumulativeStart = cumulative
//     cumulative += piece.length()
//     piece.cumulativeEnd = cumulative
//   })

//   return function fn(d: number): IPoint | undefined {
//     for (let i = 0; i < piecewise.length; i++) {
//       if (
//         d >= piecewise[i].cumulativeStart &&
//         d <= piecewise[i].cumulativeEnd
//       ) {
//         return piecewise[i].fn(d - piecewise[i].cumulativeStart)
//       }
//     }
//     return undefined
//   }
// }
