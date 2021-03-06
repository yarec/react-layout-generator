import {
  updateParamLocation,
  updateParamOffset,
  updateParamWidth,
  updateParamHeight
} from '../../editors/update'
import { PositionRef } from '../../types'
import { Block } from '../../components/Block'
import { IDataLayout } from '../../components/blockTypes'
import { IGenerator, ICreate, Generator } from '../../generators/Generator'
import { Params } from '../../components/Params'

const params = new Params({
  name: 'layoutTest',
  initialValues: [['containersize', { width: 1000, height: 1000 }]]
})

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

it('updateParamLocation returns correct value', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 },
    editor: {
      edits: [
        {
          ref: PositionRef.position,
          variable: `Location`,
          updateParam: updateParamLocation
        }
      ]
    }
  }

  const r = {
    x: 0,
    y: 10,
    width: 100,
    height: 10
  }

  const b = new Block('xx', p, g)
  const result = updateParamLocation(r, p.editor.edits[0], b)

  expect(result).toEqual({
    name: p.editor.edits[0].variable,
    value: {
      x: 0,
      y: 10
    }
  })
})

it('updateParamOffset returns correct value', () => {
  const p: IDataLayout = {
    location: { left: 0, top: 10, width: 100, height: 10 },
    editor: {
      edits: [
        {
          ref: PositionRef.position,
          variable: `Offset`,
          updateParam: updateParamOffset
        }
      ]
    }
  }

  const r = {
    x: 0,
    y: 10,
    width: 100,
    height: 10
  }

  const b = new Block('xx', p, g)
  const result = updateParamOffset(r, p.editor!.edits![0], b)

  expect(result).toEqual({
    name: p.editor!.edits![0].variable,
    value: {
      x: 0,
      y: 0
    }
  })
})

it('updateParamWidth returns correct value', () => {
  const p = {
    location: { left: 0, top: 10, width: 100, height: 10 },
    editor: {
      edits: [
        {
          ref: PositionRef.position,
          variable: `Width`,
          updateParam: updateParamWidth
        }
      ]
    }
  }

  const r = {
    x: 0,
    y: 10,
    width: 100,
    height: 10
  }

  const b = new Block('xx', p, g)
  const result = updateParamWidth(r, p.editor.edits[0], b)

  expect(result).toEqual({
    name: p.editor.edits[0].variable,
    value: 100
  })
})

it('updateParamHeight returns correct value', () => {
  const p = {
    location: { left: 0, y: 10, width: 100, height: 10 },
    editor: {
      edits: [
        {
          ref: PositionRef.position,
          variable: `Height`,
          updateParam: updateParamHeight
        }
      ]
    }
  }

  const r = {
    x: 0,
    y: 10,
    width: 100,
    height: 10
  }

  const b = new Block('xx', p, g)
  const result = updateParamHeight(r, p.editor.edits[0], b)

  expect(result).toEqual({
    name: p.editor.edits[0].variable,
    value: 10
  })
})
