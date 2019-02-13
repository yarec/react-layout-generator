import { IGenerator } from '../generators/Generator'
import { toAlign, fromAlign } from './blockUtils'
import { Rect, IOrigin, ISize, IPoint, IRect } from '../types'
import {
  IPosition,
  IBlockRect,
  IAlign,
  IEditor,
  PositionChildrenFn,
  IEdit,
  IRotate,
  IScale,
  ISkew
} from './blockTypes'
import {
  convertInputBlockRect,
  layout,
  fromOrigin,
  inverseLayout,
  toOrigin,
  connectPoint
} from './blockUtils'
import { cursor } from '../editors/cursor'
import { getUpdateHandle } from '../editors/updateHandle'
import { getExtendElement } from '../editors/extendElement'
import { clone } from '../utils'

/**
 * The purpose of Block is to specify the location and size of an element. This, of course,
 * can be done in css and React. The purpose in RLG to support dynamic computation of
 * the location and size of an element.
 *
 */
export class Block {
  private readonly _name: string
  private readonly _position: IPosition
  private readonly _g: IGenerator

  private _localParent: Block | undefined = undefined
  private _blockRect: IBlockRect
  private _align: IAlign | undefined = undefined
  private _origin: IOrigin | undefined = undefined
  private _editor: IEditor | undefined = undefined
  private _zIndex: number | undefined = undefined
  private _positionChildren: PositionChildrenFn | undefined = undefined
  private _transform: string = ''
  private _transformOrigin: string = ''
  private _handlers: Map<string, any> = new Map()
  private _onMouseDown: (e: React.MouseEvent) => void
  private _onClick: (e: React.MouseEvent) => void
  private _siblings: Map<string, boolean> = new Map()

  private _changed: boolean = true
  private _cached: Rect

  constructor(name: string, p: IPosition, g: IGenerator) {
    // console.log(`initialize Layout ${name}`)
    this._name = name
    this._position = p
    this._g = g

    this._blockRect = {}
    this._cached = new Rect({ x: 0, y: 0, width: 0, height: 0 })
    this._onMouseDown = this.noop
    this._onClick = this.noop

    this.updatePosition(p)
  }

  public get editor() {
    return this._editor
  }

  public get positionChildren() {
    return this._positionChildren
  }

  get reactTransform() {
    return this._transform
  }

  get reactTransformOrigin() {
    return this._transformOrigin
  }

  public get name() {
    return this._name
  }

  public set sibling(name: string) {
    this._siblings.set(name, true)
  }

  public setHandler(name: string, value: any) {
    this._handlers.set(name, value)
  }

  public getHandler(name: string) {
    return this._handlers.get(name)
  }

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

  public get zIndex() {
    return this._zIndex ? this._zIndex : 0
  }

  get localParent(): Block | undefined {
    return this._localParent
  }

  set localParent(parent: Block | undefined) {
    this._localParent = parent
  }

  public touch() {
    this.changed()
  }

  get generator() {
    return this._g
  }

  get x() {
    this.updateRect()
    return this._cached.x
  }

  get y() {
    this.updateRect()
    return this._cached.y
  }

  get blockRect() {
    return this._blockRect
  }

  get align() {
    return this._align
  }

  /**
   * Returns the local left coordinate in Layout space
   */
  get minX() {
    this.updateRect()
    const leftTop = this._g.params().get('containerlefttop') as IPoint
    let x = this._cached.x + leftTop.x
    let p = this._localParent
    while (p) {
      x += p.x
      p = p._localParent
    }
    return x
  }
  /**
   * Returns the local top coordinate in Layout space
   */
  get minY() {
    this.updateRect()
    const leftTop = this._g.params().get('containerlefttop') as IPoint
    let y = this._cached.y + leftTop.y
    let p = this._localParent
    while (p) {
      y += p.y
      p = p._localParent
    }
    return y
  }
  /**
   * Returns the local right coordinate in Layout space
   */
  get maxX() {
    this.updateRect()
    const leftTop = this._g.params().get('containerlefttop') as IPoint
    let r = this._cached.right + leftTop.x
    let p = this._localParent
    while (p) {
      r += p._cached.left
      p = p._localParent
    }
    return r
  }
  /**
   * Returns the local bottom coordinate in Layout space
   */
  get maxY() {
    this.updateRect()
    const leftTop = this._g.params().get('containerlefttop') as IPoint
    let b = this._cached.bottom + leftTop.y
    let p = this._localParent
    while (p) {
      b += p._cached.top
      p = p._localParent
    }
    return b
  }

  public get rect() {
    this.updateRect()
    return this._cached
  }

  public set zIndex(value: number) {
    const params = this._g.params()
    const zIndex = params.get(`${this._name}ZIndex`) as number
    if (zIndex) {
      this._zIndex = zIndex
    } else {
      this._zIndex = value ? value : 0
    }
  }

  public updatePosition(p: IPosition) {
    if (!p) {
      return
    }
    this.validate(p)
    this._origin = { x: 0, y: 0 }
    if (p.origin) {
      this._origin.x = p.origin.x * 0.01
      this._origin.y = p.origin.y * 0.01
    }

    this._blockRect = convertInputBlockRect(p.location)

    // Convert percents to decimal
    if (p.align) {
      this._align = {
        key: p.align.key,
        source: {
          x: p.align.source.x * 0.01,
          y: p.align.source.y * 0.01
        },
        self: {
          x: p.align.self.x * 0.01,
          y: p.align.self.y * 0.01
        },
        offset: {
          x: p.align.offset.x,
          y: p.align.offset.y
        }
      }
    }

    if (this._position.positionChildren) {
      this._positionChildren = this._position.positionChildren
    }

    if (p.editor) {
      this._editor = clone(p.editor)
      if (this._editor && this._editor.edits) {
        this._editor.edits.forEach((edit, i) => {
          this.setEditDefaults(edit)
        })
      }
    }

    if (p.zIndex) {
      this._zIndex = this._position.zIndex
    }

    this.transformToReactCss()

    // console.log('Layout updatePosition', this._name, this._position);
    this.changed()
  }

  private updateRect(force: boolean = false) {
    if (this._changed || force) {
      this._changed = false
      const containersize = this._g.params().get('containersize') as ISize
      const viewport = this._g.params().get('viewport') as ISize
      let value = layout(this._blockRect, {
        local: containersize,
        viewport: viewport
      })

      // Handle align - ignore actual value of location
      if (this._align) {
        const ref = this.getRef()
        if (ref) {
          let source = toAlign(ref.rect, this._align.source)

          // Translate to self location
          ;(source.x += this._align.offset.x),
            (source.y += this._align.offset.y)

          // Get left top point
          const self = fromAlign(
            { ...source, width: value.width, height: value.height },
            this._align.self
          )

          // Update cache
          this._cached.update({
            ...self,
            width: value.width,
            height: value.height
          })
          return
        }
      }

      value = fromOrigin(value, this._origin)
      this._cached.update(value)
    }
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

  public connectionHandles = () => {
    const align = this._align
    if (align) {
      const ref = this.getRef()
      if (ref) {
        const r1: IRect = ref.rect

        const c1 = connectPoint(r1, align.source)

        const r2 = this.rect

        const c2 = connectPoint(r2, align.self)

        return [c1, c2]
      }
    }
    return []
  }

  /**
   * Change the block state
   */
  public update = (r: IRect) => {
    // Takes in world coordinates
    // console.log(`Position update x: ${location.x} y: ${location.y}`)

    if (this._align && this.getRef()) {
      const align = this._align
      // Get source and self points
      const ref = this.getRef()
      if (ref) {
        const r1 = ref!.rect
        const p1 = connectPoint(r1, this._align.source)

        const r2 = this.rect
        const p2 = connectPoint(r2, align.self)

        // Compute new offset
        const offset: IPoint = {
          x: p2.x - p1.x,
          y: p2.y - p1.y
        }

        // Update align offset
        this._align.offset = offset
      }
    } else {
      const _r = toOrigin(r, this._origin)

      const containersize = this._g.params().get('containersize') as ISize
      const viewport = this._g.params().get('viewport') as ISize
      this._blockRect = inverseLayout(_r, this._blockRect, {
        local: containersize,
        viewport: viewport
      })
    }

    this.changed()
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

  /**
   * Returns the block that is linked to this block
   */
  private getRef = () => {
    let ref
    if (this._align) {
      if (typeof this._align.key === 'string') {
        ref = this._g.lookup(this._align.key as string)
      } else {
        const blocks = this._g.blocks()
        if (blocks) {
          ref = blocks.find(this._align.key as number)
        }
      }
    }
    if (ref) {
      ref.sibling = this.name
    }
    return ref
  }

  private validate(p: IPosition) {
    // if (p.editor && p.editor.edits) {
    //   // p.editor.edits.forEach((edit) => {
    //   //   if (edit.ref === PositionRef.position) {
    //   //   }
    //   // })
    //   if (p.location.unit)) {
    //     console.error(`Position ${namedUnit(p.location.unit)} in
    //     ${this.name} is NOT supported
    //     for location. It is only supported for size.
    //     `)
    //   }
    // }
  }

  private transformToReactCss() {
    this._transform = ''
    this._transformOrigin = ''
    if (this._position.transform) {
      this._position.transform.forEach((t: IRotate | IScale | ISkew) => {
        if ('rotate' in t) {
          const i = t as IRotate
          this._transform += ` rotate(${i.rotate}deg)`
          this._transformOrigin = `${t.origin.x} ${t.origin.y}`
        }
        if ('scale' in t) {
          const i = t as IScale
          if (i.scale['x']) {
            this._transform += ` scaleX(${i.scale['x']}) scaleY(${
              i.scale['y']
            })`
          } else {
            this._transform += ` scale(${i.scale as number})`
          }
        }
        if ('skew' in t) {
          const i = t as ISkew
          if (i.skew['x']) {
            this._transform += ` scaleX(${i.skew['x']}) scaleY(${i.skew['y']})`
          } else {
            this._transform += ` scale(${i.skew as number})`
          }
        }
      })
    }
  }

  /**
   * Noop handler used for initialization.
   * @Ignore
   */
  private noop = () => {
    console.error('Block: Event handler not defined')
  }
}
