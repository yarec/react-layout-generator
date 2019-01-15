// import * as React from 'react'

import { cursor } from '../editors/cursor'
import { getExtendElement, ExtendElement } from '../editors/extendElement'
import { getUpdateHandle, UpdateHandle } from '../editors/updateHandle'
import { UpdateParam } from '../editors/updateParam'
import { IGenerator } from '../generators/Generator'
import { flowLayoutLayer } from '../generators/utils'
import {
  IPoint,
  IOrigin,
  ISize,
  Unit,
  PositionRef,
  Rect,
  isUnmanaged,
  namedUnit
} from '../types'
import { clone } from '../utils'

export interface IAlign {
  key: string | number
  offset: IPoint
  source: IOrigin
  self: IOrigin
}

export interface IMenuItem {
  name: string
  disabled?: boolean
  checked?: boolean
  command?: () => void
}

export interface IEdit {
  ref: PositionRef
  variable?: string
  cursor?: string
  updateHandle?: UpdateHandle
  extendElement?: ExtendElement
  updateParam?: UpdateParam
  contextMenu?: IMenuItem[]
}

export type PositionChildren = (
  block: Block,
  g: IGenerator,
  index: number
) => Block | undefined

export interface IHandlers {
  onMouseDown?: () => void
}

export type Layer = (zIndex: number) => number
export enum LayerOption {
  normal = 0,
  moveToBack,
  moveToFront,
  moveUp,
  moveDown
}

export interface IPositionLocation extends IPoint {
  x: number
  y: number
  unit?: Unit
}

export interface IPositionSize extends ISize {
  width: number
  height: number
  unit?: Unit
}

export interface IPosition {
  units: {
    location: Unit
    size: Unit
  }
  align?: IAlign
  positionChildren?: PositionChildren
  editor?: {
    selectable?: boolean
    contextMenu?: IMenuItem[]
    edits?: IEdit[]
  }
  layer?: LayerOption
  handlers?: IHandlers
  origin?: IOrigin
  location: IPositionLocation
  size: IPositionSize
}

/**
 * Defines the location and size using
 * specified origin and units. Supports edit handles
 * defined by IAlign (.eg left center, right bottom)
 */
export class Block {
  get name() {
    return this._name
  }

  get editor() {
    return this._position.editor
  }

  get units() {
    return this._position.units
  }

  get location() {
    return this._position.location
  }

  get size() {
    return this._position.size
  }

  get resize() {
    return this.onResize
  }

  get generator() {
    return this._g
  }

  get positionChildren() {
    return this._positionChildren
  }

  get position() {
    return this._position
  }

  set position(p: IPosition) {
    this._position = p
  }

  set sibling(key: string) {
    this._siblings.set(key, true)
  }

  private _siblings: Map<string, boolean> = new Map()
  private _name: string
  private _position: IPosition
  private _changed: boolean
  private _cached: Rect
  private _g: IGenerator
  private _positionChildren: PositionChildren | undefined
  private _layer: Layer = flowLayoutLayer
  private _onMouseDown: (e: React.MouseEvent) => void
  private _onClick: (e: React.MouseEvent) => void

  constructor(name: string, p: IPosition, g: IGenerator) {
    // console.log(`initialize Layout ${name}`)
    this._name = name
    if (p) {
      this._position = clone(p)
    } else {
      this.position = {
        units: {
          location: Unit.pixel,
          size: Unit.pixel
        },
        location: { x: 0, y: 0 },
        size: { width: 100, height: 100 }
      }
    }
    this.updatePosition(this._position)
    this.updateLayer(this._position.layer)
    this._cached = new Rect({ x: 0, y: 0, width: 0, height: 0 })
    this._changed = true
    this._g = g
    this._positionChildren = this._position.positionChildren
    this._onMouseDown = this.noop
    this._onClick = this.noop
  }

  public noop = () => {
    console.error('Event handler not defined')
  }

  // public clone = (): Layout => {
  //   const p = clone(this._position);
  //   return new Layout(this._name, p, this._g);
  // }

  public get onMouseDown() {
    return this._onMouseDown
  }

  public set onMouseDown(fn: (e: React.MouseEvent) => void) {
    this._onMouseDown = fn
  }

  public get onClick() {
    return this._onClick
  }

  public set onClick(fn: (e: React.MouseEvent) => void) {
    this._onClick = fn
  }

  public layer(zIndex: number) {
    return this._layer(zIndex)
  }

  public connectionHandles = () => {
    const align = this._position.align
    if (align) {
      const ref = this.getRef()
      if (ref) {
        const p1: IPoint = ref.fromLocation()
        const s1: ISize = ref.fromSize()

        const r1 = this.getConnectPoint(p1, s1, align.source)

        const p2: IPoint = this.fromLocation()
        const s2: ISize = this.fromSize()

        const r2 = this.getConnectPoint(p2, s2, align.self)

        return [r1, r2]
      }
    }
    return []
  }

  /**
   * Converts location to pixels
   */
  public fromLocation = (): IPoint => {
    // Handle align - ignore actual value of location
    if (this._position.align) {
      const ref = this.getRef()
      if (ref) {
        const p: IPoint = ref.fromLocation()
        const s: ISize = ref.fromSize()
        const source: IPoint = this.toAlign(p, s, this._position.align.source)
        const offset: IPoint = {
          x: source.x + this._position.align.offset.x,
          y: source.y + this._position.align.offset.y
        }
        return this.fromAlign(
          offset,
          this.fromSize(),
          this._position.align.self
        )
      }
    }

    const point = this.scale(
      this._position.location,
      this._position.units.location
    ) as IPoint

    if (this._position.origin) {
      return this.fromOrigin(point, this._position.origin, this.fromSize())
    }
    return point
  }

  /**
   * Converts size to pixels
   */
  public fromSize = () => {
    // console.log('size ' + this._position.size.width)
    return this.scale(this._position.size, this._position.units.size) as ISize
  }

  public rect = (force?: boolean) => {
    if (this._changed || force) {
      this._changed = false
      this._cached.update({ ...this.fromLocation(), ...this.fromSize() })
    }
    return this._cached.data
  }

  public touch = () => {
    this.changed()
  }

  /**
   * Change the block state
   */
  public update = (location: IPoint, size?: ISize) => {
    // Takes in world coordinates
    // console.log(`Position update x: ${location.x} y: ${location.y}`)

    const itemSize = size ? size : this.fromSize()

    if (this._position.align && this.getRef()) {
      const align = this._position.align
      // Get source and self points
      const ref = this.getRef()
      const p1: IPoint = ref!.fromLocation()
      const s1: ISize = ref!.fromSize()

      const r1 = this.getConnectPoint(p1, s1, align.source)

      const p = this.toOrigin(location, this._position.origin, itemSize)
      // const p2 = this.inverseScale(p, this._position.units.location) as IPoint;
      const s2 = this.inverseScale(itemSize, this._position.units.size) as ISize

      const r2 = this.getConnectPoint(p, s2, align.self)

      // Compute new offset
      const offset: IPoint = {
        x: r2.x - r1.x,
        y: r2.y - r1.y
      }

      // Update align offset
      align.offset = offset
    } else {
      const p = this.toOrigin(location, this._position.origin, itemSize)
      this._position.location = this.inverseScale(
        p,
        this._position.units.location
      ) as IPoint
      this._position.size = this.inverseScale(
        itemSize,
        this._position.units.size
      ) as ISize
    }
    this.changed()
  }

  public updateSize = (size: ISize) => {
    // Takes in world coordinates
    this._position.size = this.inverseScale(
      size,
      this._position.units.size
    ) as ISize
    this.changed()
  }

  /**
   * Take unit and convert to real world
   */
  public scale = (
    input: IPoint | ISize,
    unit: Unit | undefined
  ): IPoint | ISize => {
    switch (unit) {
      case Unit.percent: {
        const size = this._g.params().get('containersize') as ISize
        if ('x' in input) {
          const p = input as IPoint
          return {
            x: p.x * size.width,
            y: p.y * size.height
          }
        } else {
          const s = input as ISize
          return {
            width: s.width * size.width,
            height: s.height * size.height
          }
        }
        break
      }
      case Unit.preserve: {
        const size = this._g.params().get('containersize') as ISize

        const minWidth = size.width < size.height ? size.width : size.height

        if ('x' in input) {
          const p = input as IPoint
          return {
            x: p.x * minWidth,
            y: p.y * minWidth
          }
        } else {
          const s = input as ISize
          return {
            width: s.width * minWidth,
            height: s.height * minWidth
          }
        }
        break
      }
      case Unit.preserveWidth: {
        const size = this._g.params().get('containersize') as ISize

        const factor = size.width

        if ('x' in input) {
          const p = input as IPoint
          return {
            x: p.x * factor,
            y: p.y * factor
          }
        } else {
          const s = input as ISize
          return {
            width: s.width * factor,
            height: s.height * factor
          }
        }
        break
      }
      case Unit.preserveHeight: {
        const size = this._g.params().get('containersize') as ISize

        const factor = size.height

        if ('x' in input) {
          const p = input as IPoint
          return {
            x: p.x * factor,
            y: p.y * factor
          }
        } else {
          const s = input as ISize
          return {
            width: s.width * factor,
            height: s.height * factor
          }
        }
        break
      }
    }
    // default no translation needed
    return input
  }

  public onResize = (width: number, height: number) => {
    if (
      this._position.size.width !== width ||
      this._position.size.height !== height
    ) {
      this._position.size.width = width
      this._position.size.height = height
      this.changed()
    }
  }

  public updateLayer(layer?: LayerOption) {
    if (layer === undefined) {
      return
    }
    switch (layer) {
    }
  }

  public validate(p: IPosition) {
    if (p.editor && p.editor.edits) {
      // p.editor.edits.forEach((edit) => {
      //   if (edit.ref === PositionRef.position) {
      //   }
      // })

      if (p.units && isUnmanaged(p.units.location)) {
        console.error(`Position ${namedUnit(p.units.location)} in 
        ${this.name} is NOT supported
        for location. It is only supported for size.
        `)
      }
    }
  }

  public updatePosition(p: IPosition) {
    this.validate(p)
    if (this._position.origin && p.origin) {
      this._position.origin.x = p.origin.x * 0.01
      this._position.origin.y = p.origin.y * 0.01
    }

    // Convert percents to decimal
    const locUnit = this._position.units.location
    if (
      locUnit === Unit.percent ||
      locUnit === Unit.preserve ||
      locUnit === Unit.preserveWidth ||
      locUnit === Unit.preserveHeight
    ) {
      this._position.location.x = p.location.x * 0.01
      this._position.location.y = p.location.y * 0.01
    } else if (locUnit === Unit.pixel) {
      this._position.location.x = p.location.x
      this._position.location.y = p.location.y
    } else if (
      locUnit === Unit.unmanaged ||
      locUnit === Unit.unmanagedWidth ||
      locUnit === Unit.unmanagedHeight
    ) {
      // TODO needed? only applies to size
    } else {
      console.error('Block.updatePosition add support for new unit')
    }

    // Convert percents to decimal
    const sizeUnit = this._position.units.size
    if (
      sizeUnit === Unit.percent ||
      sizeUnit === Unit.preserve ||
      sizeUnit === Unit.preserveWidth ||
      sizeUnit === Unit.preserveHeight
    ) {
      this._position.size.width = p.size.width * 0.01
      this._position.size.height = p.size.height * 0.01
    } else if (sizeUnit === Unit.pixel) {
      this._position.size.width = p.size.width
      this._position.size.height = p.size.height
    } else if (
      sizeUnit === Unit.unmanaged ||
      sizeUnit === Unit.unmanagedWidth ||
      sizeUnit === Unit.unmanagedHeight
    ) {
      // TODO needed? only applies to size
    } else {
      console.error('Block.updatePosition add support for new unit')
    }

    // Convert percents to decimal
    if (this._position.align && p.align) {
      this._position.align.source.x = p.align!.source.x * 0.01
      this._position.align.source.y = p.align!.source.y * 0.01
      this._position.align.self.x = p.align!.self.x * 0.01
      this._position.align.self.y = p.align!.self.y * 0.01
      this._position.align.offset.x = p.align!.offset.x
      this._position.align.offset.y = p.align!.offset.y
    }

    if (this._position.editor) {
      if (this._position.editor.edits) {
        this._position.editor.edits.forEach((edit, i) => {
          this.setEditDefaults(edit)
        })
      }
    }

    // console.log('Layout updatePosition', this._name, this._position);
    this.changed()
  }

  public setEditDefaults(edit: IEdit) {
    if (!edit.cursor) {
      edit.cursor = cursor(edit.ref)
    }
    if (!edit.updateHandle) {
      edit.updateHandle = getUpdateHandle(edit.ref)
    }
    if (!edit.extendElement) {
      edit.extendElement = getExtendElement(edit.ref)
    }
  }

  private changed() {
    this._changed = true
    this._siblings.forEach((value: boolean, key: string) => {
      const l = this._g.lookup(key)
      if (l) {
        l.touch()
      }
    })
  }

  private getRef = () => {
    let ref
    if (this._position.align) {
      if (typeof this._position.align.key === 'string') {
        ref = this._g.lookup(this._position.align.key as string)
      } else {
        const l = this._g.blocks()
        if (l) {
          ref = l.find(this._position.align.key as number)
        }
      }
    }
    if (ref) {
      ref.sibling = this.name
    }
    return ref
  }

  private getConnectPoint(l: IPoint, s: ISize, a: IOrigin) {
    return { x: l.x + s.width * a.x, y: l.y + s.height * a.y }
  }

  /**
   * Take pixels and convert to percent
   */
  private inverseScale = (
    input: IPoint | ISize,
    unit: Unit
  ): IPoint | ISize => {
    switch (unit) {
      case Unit.percent: {
        const size = this._g.params().get('containersize') as ISize
        if (size.width && size.height) {
          if ('x' in input) {
            const p = input as IPoint
            return {
              x: p.x / size.width,
              y: p.y / size.height
            }
          } else {
            const s = input as ISize
            return {
              width: s.width / size.width,
              height: s.height / size.height
            }
          }
        }
        break
      }
      case Unit.preserve: {
        const size = this._g.params().get('containersize') as ISize

        const minWidth = size.width < size.height ? size.width : size.height
        if (minWidth) {
          if ('x' in input) {
            const p = input as IPoint
            return {
              x: p.x / minWidth,
              y: p.y / minWidth
            }
          } else {
            const s = input as ISize
            return {
              width: s.width / minWidth,
              height: s.height / minWidth
            }
          }
        }
        break
      }
      case Unit.preserveWidth: {
        const size = this._g.params().get('containersize') as ISize
        const factor = size.width
        if (factor) {
          if ('x' in input) {
            const p = input as IPoint
            return {
              x: p.x / factor,
              y: p.y / factor
            }
          } else {
            const s = input as ISize
            return {
              width: s.width / factor,
              height: s.height / factor
            }
          }
        }
        break
      }
      case Unit.preserveHeight: {
        const size = this._g.params().get('containersize') as ISize
        const factor = size.height
        if (factor) {
          if ('x' in input) {
            const p = input as IPoint
            return {
              x: p.x / factor,
              y: p.y / factor
            }
          } else {
            const s = input as ISize
            return {
              width: s.width / factor,
              height: s.height / factor
            }
          }
        }
        break
      }
    }

    // default
    return input
  }

  /**
   * Defines the origin of location in percent
   * If the origin is (50,50) then the top left is
   * (p.x - .50 * s.x, p.y - .50 * s.y)
   *
   *  x----------------
   *  |               |
   *  |       o       |
   *  |               |
   *  ----------------
   *  o: origin
   *  x: left top
   */
  private fromOrigin = (p: IPoint, origin: IPoint, s: ISize): IPoint => {
    return {
      x: p.x - origin.x * s.width,
      y: p.y - origin.y * s.height
    }
  }

  /**
   * reverses fromOrigin
   */
  private toOrigin = (
    p: IPoint,
    origin: IPoint | undefined,
    s: ISize
  ): IPoint => {
    if (origin) {
      return {
        x: p.x + origin.x * s.width,
        y: p.y + origin.y * s.height
      }
    }
    return p
  }

  /**
   * Compute left top point of rectangle based on align value
   * If p represents the bottom center point then the top left
   * position is (p.x - s.x / 2, p.y - s.y;)
   * Inverse of toAlign.
   */
  private fromAlign = (p: IPoint, s: ISize, origin: IOrigin): IPoint => {
    return {
      x: p.x - origin.x * s.width,
      y: p.y - origin.y * s.height
    }
  }

  /**
   * Gets the point of an handle given an origin and size
   * if align is left top then return (rect.left, rect.top)
   * if align if bottom center then return
   * (r.left + r.halfWidth, r.bottom;)
   *  Inverse of fromAlign.
   */
  private toAlign = (p: IPoint, s: ISize, align: IOrigin): IPoint => {
    return {
      x: p.x + align.x * s.width,
      y: p.y + align.y * s.height
    }
  }
}
