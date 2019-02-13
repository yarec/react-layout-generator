import { Block } from '../../components/Block'
import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'
// import { Unit } from '../../types'

const params = new Params({
  name: 'layoutTest',
  initialValues: [
    ['containersize', { width: 1000, height: 1000 }],
    ['containerlefttop', { x: 100, y: 50 }],
    ['viewport', { width: 1000, height: 1000 }]
  ]
})

function init(_g: IGenerator) {
  return _g.blocks()
}

function create(args: ICreate) {
  let block
  const blocks = args.g.blocks()
  if (blocks) {
    block = blocks.set('test', args.position, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

// it('location #1 - default units', () => {
//   const p = {
//     location: { left: 0, top: 10, width: 100, height: 10 }
//   }

//   const b = new Block('test', p, g)
//   expect(b.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
// })

it('location #2 - location in percent', () => {
  const p = {
    location: { left: '50%', top: '50%', width: 10, height: 10 }
  }
  const b = new Block('test', p, g)
  expect(b.rect).toEqual({ x: 500, y: 500, width: 10, height: 10 })
})

// it('location #3', () => {
//   const p = {
//     location: {left: '50vh', top: '50vh', width: 10, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 500, y: 500, width: 10, height: 10 })
// })

// it('location #4', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { left: 50, top: 50, width: 10, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 495, y: 495, width: 10, height: 10 })
// })

// it('size #1', () => {
//   const p = {
//     location: { left: 0, top: 10, width: 100, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
// })

// it('size #2', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { left: 0, top: 10, width: 100, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
// })

// it('size #3', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { left: 50, top: 50, width: 100, height: 100 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 50, y: 50, width: 100, height: 100 })
// })

// it('size #4', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { left: 50, top: 50, width: '10%', height: '10%' }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({  x: 0, y: 10,  width: 100, height: 100 })
// })

// it('rect #1', () => {
//   const p = {
//     location: { left: 0, top: 10, width: 100, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
// })

// it('rect #2', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { left: 500, yop: 500, width: 100, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 450, y: 495, width: 100, height: 10 })
// })

// it('rect #3', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { x: '50%', y: '50%', width: 100, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect).toEqual({ x: 450, y: 495, width: 100, height: 10 })
// })

// it('rect #4', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { x: 50, y: 50, unit: Unit.percent },
//     size: { width: 10, height: 5, unit: Unit.percent }
//   }
//   const l = new Block('test', p, g)
//   expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 })
// })

// it('update #1', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { x: 50, y: 50, unit: Unit.percent },
//     size: { width: 10, height: 5, unit: Unit.percent }
//   }
//   const l = new Block('test', p, g)
//   l.update({ x: 450, y: 475 }, { width: 100, height: 50 })

//   expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 })
// })

// it('update #2', () => {
//   const p = {
//     location: { x: 250, y: 250 },
//     size: { width: 100, height: 50 }
//   }
//   const l = new Block('test', p, g)
//   l.update({ x: 250, y: 250 }, { width: 50, height: 50 })

//   expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 })
// })

// it('update #3', () => {
//   const p = {
//     location: { x: 250, y: 250, unit: Unit.percent },
//     size: { width: 100, height: 50 }
//   }
//   const l = new Block('test', p, g)
//   l.update({ x: 250, y: 250 }, { width: 50, height: 50 })

//   expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 })
// })

// it('align #1', () => {
//   const p = {
//     location: { x: 100, y: 100 },
//     size: { width: 100, height: 100 }
//   }

//   const pAlign = {
//     location: { x: 0, y: 0 },
//     size: { width: 100, height: 80 },
//     align: {
//       key: 'one',
//       offset: { x: 20, y: 0 },
//       source: { x: 100, y: 0 },
//       self: { x: 0, y: 50 }
//     }
//   }

//   g.clear()
//   const blocks = g.blocks()
//   blocks.set('one', p, g)
//   const bAlign = blocks.set('bAlign', pAlign, g)

//   if (bAlign) {
//     expect(bAlign.rect()).toEqual({ x: 220, y: 60, width: 100, height: 80 })
//   } else {
//     expect(bAlign).toEqual(undefined)
//   }
// })

// it('misc #1', () => {
//   const p = {
//     location: { x: 250, y: 250 },
//     size: { width: 100, height: 50 }
//   }
//   const b = new Block('test', p, g)
//   b.update({ x: 250, y: 250 }, { width: 50, height: 50 })

//   expect(b.location).toEqual({ x: 250, y: 250 })
//   expect(b.size).toEqual({ width: 50, height: 50 })
//   expect(b.resize).toBeTruthy()
//   expect(b.generator).toBeTruthy()
// })

// it('misc #2', () => {
//   const p = {
//     location: { x: 250, y: 250, unit: Unit.percent },
//     size: { width: 100, height: 50 }
//   }
//   const b = new Block('test', p, g)
//   b.update({ x: 250, y: 250 }, { width: 50, height: 50 })

//   expect(b.noop).toBeTruthy()
//   expect(b.connectionHandles()).toBeTruthy()
//   expect(b.touch()).toEqual(undefined)
// })

// it('transform #1', () => {
//   const p = {
//     location: { x: 250, y: 250, unit: Unit.percent },
//     size: { width: 100, height: 50 },
//     transform: [{ rotate: 10, origin: { x: 50, y: 50 } }]
//   }
//   const b = new Block('test', p, g)

//   expect(b.reactTransform).toEqual(` rotate(${10}deg)`)
//   expect(b.reactTransformOrigin).toEqual(`${50} ${50}`)
// })

// it('local coordinate #1', () => {
//   const p = {
//     location: { x: 250, y: 150, unit: Unit.pixel },
//     size: { width: 100, height: 50 },
//     transform: [{ rotate: 10, origin: { x: 50, y: 50 } }]
//   }
//   const b = new Block('test', p, g)

//   expect(b.minX).toEqual(350)
//   expect(b.minY).toEqual(200)
//   expect(b.maxX).toEqual(450)
//   expect(b.maxY).toEqual(250)
// })

// it('location left top #1', () => {
//   const p = {
//     origin: { x: 50, y: 50 },
//     location: { left: 50, top: 50, unit: Unit.percent },
//     size: { width: 10, height: 10 }
//   }
//   const l = new Block('test', p, g)
//   expect(l.fromLocation()).toEqual({ x: 495, y: 495 })
// })

// Test align, connection points
