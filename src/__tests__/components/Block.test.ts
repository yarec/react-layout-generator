import { Block } from '../../components/Block'
import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'
import {
  toXPixel,
  IBounds,
  toYPixel,
  layout
} from '../../components/blockUtils'
import { Unit } from '../../types'
import { IBlockRect, IDataLayout } from '../../components/blockTypes'
// import { Unit } from '../../types'

const params = new Params({
  name: 'layoutTest',
  initialValues: [
    ['containersize', { width: 1000, height: 1000 }],
    ['containerlefttop', { x: 100, y: 50 }],
    ['viewport', { width: 1000, height: 1000 }]
  ]
})

const bounds: IBounds = {
  container: { width: 1000, height: 1000 },
  viewport: { width: 1000, height: 1000 }
}

function init(_g: IGenerator) {
  return _g.blocks()
}

function create(args: ICreate) {
  let block
  const blocks = args.g.blocks()
  if (blocks) {
    block = blocks.set('test', args.dataLayout, args.g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

it('toXPixel #1 - default units', () => {
  expect(toXPixel(10, Unit.pixel, bounds)).toEqual(10)
})

it('toXPixel #2 - default units', () => {
  expect(toXPixel(0.1, Unit.percent, bounds)).toEqual(100)
})

it('toXPixel #3 - default units', () => {
  expect(toXPixel(0.1, Unit.vmin, bounds)).toEqual(100)
})

it('toXPixel #4 - default units', () => {
  expect(toXPixel(0.1, Unit.vmax, bounds)).toEqual(100)
})

it('toXPixel #5 - default units', () => {
  expect(toXPixel(0.1, Unit.vw, bounds)).toEqual(100)
})

it('toXPixel #6 - default units', () => {
  expect(toXPixel(0.1, Unit.vh, bounds)).toEqual(100)
})

it('toYPixel #1 - default units', () => {
  expect(toYPixel(10, Unit.pixel, bounds)).toEqual(10)
})

it('toYPixel #2 - default units', () => {
  expect(toYPixel(0.1, Unit.percent, bounds)).toEqual(100)
})

it('toYPixel #3 - default units', () => {
  expect(toYPixel(0.1, Unit.vmin, bounds)).toEqual(100)
})

it('toXPixel #4 - default units', () => {
  expect(toYPixel(0.1, Unit.vmax, bounds)).toEqual(100)
})

it('toYPixel #5 - default units', () => {
  expect(toYPixel(0.1, Unit.vw, bounds)).toEqual(100)
})

it('toYPixel #6 - default units', () => {
  expect(toYPixel(0.1, Unit.vh, bounds)).toEqual(100)
})

it('layout #1', () => {
  const args: IBlockRect = {
    left: 10,
    top: 10,
    width: 10,
    height: 10
  }
  expect(layout(args, bounds)).toEqual({ x: 10, y: 10, width: 10, height: 10 })
})

it('layout #2', () => {
  const args: IBlockRect = {
    left: 0.01,
    leftUnit: Unit.percent,
    top: 0.01,
    topUnit: Unit.percent,
    width: 0.01,
    widthUnit: Unit.percent,
    height: 0.01,
    heightUnit: Unit.percent
  }
  expect(layout(args, bounds)).toEqual({ x: 10, y: 10, width: 10, height: 10 })
})

it('layout #3', () => {
  const args: IBlockRect = {
    left: 0.01,
    leftUnit: Unit.vmin,
    top: 0.01,
    topUnit: Unit.vmin,
    width: 0.01,
    widthUnit: Unit.vmin,
    height: 0.01,
    heightUnit: Unit.vmin
  }
  expect(layout(args, bounds)).toEqual({ x: 10, y: 10, width: 10, height: 10 })
})

it('layout #4', () => {
  const args: IBlockRect = {
    left: 0.01,
    leftUnit: Unit.vmax,
    top: 0.01,
    topUnit: Unit.vmax,
    width: 0.01,
    widthUnit: Unit.vmax,
    height: 0.01,
    heightUnit: Unit.vmax
  }
  expect(layout(args, bounds)).toEqual({ x: 10, y: 10, width: 10, height: 10 })
})

it('layout #54', () => {
  const args: IBlockRect = {
    left: 0.01,
    leftUnit: Unit.vw,
    top: 0.01,
    topUnit: Unit.vw,
    width: 0.01,
    widthUnit: Unit.vw,
    height: 0.01,
    heightUnit: Unit.vw
  }
  expect(layout(args, bounds)).toEqual({ x: 10, y: 10, width: 10, height: 10 })
})

it('layout #54', () => {
  const args: IBlockRect = {
    left: 0.01,
    leftUnit: Unit.vh,
    top: 0.01,
    topUnit: Unit.vh,
    width: 0.01,
    widthUnit: Unit.vh,
    height: 0.01,
    heightUnit: Unit.vh
  }
  expect(layout(args, bounds)).toEqual({ x: 10, y: 10, width: 10, height: 10 })
})

it('location #1 - default units', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const b = new Block('test', p, g)
  expect(b.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
})

it('location #2 - location in percent', () => {
  const p = {
    location: { left: '50%', top: '50%', width: 10, height: 10 }
  }
  const b = new Block('test', p, g)
  expect(b.rect).toEqual({ x: 500, y: 500, width: 10, height: 10 })
})

it('location #3', () => {
  const p = {
    location: { left: '50vh', top: '50vh', width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 500, y: 500, width: 10, height: 10 })
})

it('location #4', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: '50%', top: '50%', width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 495, y: 495, width: 10, height: 10 })
})

it('size #1', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
})

it('size #2', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: -50, y: 5, width: 100, height: 10 })
})

it('size #3', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: 50, top: 50, width: 100, height: 100 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 0, y: 0, width: 100, height: 100 })
})

it('size #4', () => {
  const p = {
    // origin: { x: .50, y: .50 },
    location: { left: 50, top: 50, width: '10%', height: '10%' }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 50, y: 50, width: 100, height: 100 })
})

it('rect #1', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 0, y: 10, width: 100, height: 10 })
})

it('rect #2', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: 500, top: 500, width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 450, y: 495, width: 100, height: 10 })
})

it('rect #3', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: '50%', top: '50%', width: 100, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 450, y: 495, width: 100, height: 10 })
})

it('rect #4', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: '50%', top: '50%', width: '10%', height: '5%' }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 450, y: 475, width: 100, height: 50 })
})

it('leftTop only #1', () => {
  const p = {
    location: { left: '50%', top: '50%' }
  }
  const l = new Block('test', p, g)

  expect(l.rect).toEqual({ x: 500, y: 500, width: 500, height: 500 })
})

it('leftTop only #2', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: '50%', top: '50%' }
  }
  const l = new Block('test', p, g)

  expect(l.rect).toEqual({ x: 250, y: 250, width: 500, height: 500 })
})

it('update #1', () => {
  const p = {
    // origin: { x: .50, y: .50 },
    location: { left: 50, top: 50, width: 50, height: 50 }
  }
  const l = new Block('test', p, g)

  l.update({ x: 500, y: 500, width: 50, height: 50 })

  expect(l.rect).toEqual({ x: 500, y: 500, width: 50, height: 50 })
})

it('update #2', () => {
  const p = {
    location: { left: 250, top: 250, width: 100, height: 50 }
  }
  const l = new Block('test', p, g)
  l.update({ x: 250, y: 250, width: 50, height: 50 })

  expect(l.rect).toEqual({ x: 250, y: 250, width: 50, height: 50 })
})

it('update #3', () => {
  const p = {
    location: {
      left: 200,
      top: 200,
      width: '25%',
      height: '30%'
    }
  }

  const l = new Block('test', p, g)

  const arg = {
    left: 200,
    top: 200,
    width: 0.25,
    widthUnit: Unit.percent,
    height: 0.3,
    heightUnit: Unit.percent
  }

  expect(l.blockRect).toEqual(arg)
})

it('update #4', () => {
  const p = {
    location: {
      left: 200,
      top: 200,
      width: '25%',
      height: '25%'
    }
  }

  const l = new Block('test', p, g)

  l.update({ x: 250, y: 250, width: 250, height: 250 })

  const arg1: IBlockRect = {
    left: 250,
    top: 250,
    width: 0.25,
    widthUnit: Unit.percent,
    height: 0.25,
    heightUnit: Unit.percent
  }

  expect(l.blockRect).toEqual(arg1)
})

it('align #1', () => {
  const p: IDataLayout = {
    location: { left: 100, top: 100, width: 100, height: 100 }
  }

  const pAlign: IDataLayout = {
    location: { left: 0, top: 0, width: 100, height: 80 },
    align: {
      key: 'one',
      offset: { x: 20, y: 0 },
      source: { x: 100, y: 0 },
      self: { x: 0, y: 50 }
    }
  }

  const blocks = g.blocks()
  blocks.set('one', p, g)
  const bAlign = blocks.set('bAlign', pAlign, g)

  if (bAlign) {
    expect(bAlign.rect).toEqual({ x: 220, y: 60, width: 100, height: 80 })
  } else {
    expect(bAlign).toEqual(undefined)
  }
})

it('misc #1', () => {
  const p = {
    location: { left: 250, top: 250, width: 100, height: 50 }
  }
  const b = new Block('test', p, g)
  b.update({ x: 250, y: 250, width: 50, height: 50 })

  expect(b.rect).toEqual({ x: 250, y: 250, width: 50, height: 50 })
  expect(b.generator).toBeTruthy()
})

it('misc #2', () => {
  const p = {
    location: { left: '250%', top: '250%', width: 100, height: 50 }
  }
  const b = new Block('test', p, g)
  b.update({ x: 250, y: 250, width: 50, height: 50 })

  expect(b.connectionHandles()).toBeTruthy()
  expect(b.touch()).toEqual(undefined)
})

it('transform #1', () => {
  const p: IDataLayout = {
    location: { left: '250%', top: '250%', width: 100, height: 50 },
    transform: [{ rotate: 10, origin: { x: 0.5, y: 0.5 } }]
  }
  const b = new Block('test', p, g)

  expect(b.reactTransform).toEqual(` rotate(${10}deg)`)
  expect(b.reactTransformOrigin).toEqual(`${0.5} ${0.5}`)
})

it('local coordinate #1', () => {
  const p = {
    location: { left: 250, top: 150, width: 100, height: 50 },
    transform: [{ rotate: 10, origin: { x: 0.5, y: 0.5 } }]
  }
  const b = new Block('test', p, g)

  expect(b.minX).toEqual(350)
  expect(b.minY).toEqual(200)
  expect(b.maxX).toEqual(450)
  expect(b.maxY).toEqual(250)
})

it('location left top #1', () => {
  const p = {
    origin: { x: 0.5, y: 0.5 },
    location: { left: '50%', top: '50%', width: 10, height: 10 }
  }
  const l = new Block('test', p, g)
  expect(l.rect).toEqual({ x: 495, y: 495, width: 10, height: 10 })
})

// Test align, connection points
