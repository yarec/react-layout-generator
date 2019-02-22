import { IGenerator } from '../generators/Generator'
import { toAlign, fromAlign } from './blockUtils'
import { Rect, IOrigin, ISize, IPoint, IRect } from '../types'
import {
  IDataLayout,
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
 * The purpose of Block is to specify the location and size of an element.
 *
 * There are two ways to manipulate a blocks position and size. The first is a css like
 * [block specification](../interfaces/IExRect.html) - left, top, right, bottom, width, and
 * height all with optional units. The second is just updating its
 * [result rect](../classes/block.html#update) in pixels. The two are automatically kept
 * in sync.
 *
 *
 */
export class Block {
  private readonly _name: string
  private readonly _position: IDataLayout
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

  /**
   * @param name
   * The name of the block. It must be unique within a [Layout](../classes/layout.html).
   * @param p
   * [Options](../interfaces/idatalayout.html) for a blocks behavior. Note that a block can be
   * defined in a generator function and then referenced by name in JSX. The
   * [data-layout](../interfaces/idatalayout.html) property is used in both places. If it is
   * defined in a generator then only the name will be used in JSX. The other properties of
   * data-layout will not be used.
   * @param g
   * The [generator](../classes/generator.html) for this Layout.
   */
  constructor(name: string, p: IDataLayout, g: IGenerator) {
    // console.log(`initialize Layout ${name}`)
    this._name = name
    this._position = p
    this._g = g

    this._blockRect = {}
    this._cached = new Rect({ x: 0, y: 0, width: 0, height: 0 })
    this._onMouseDown = this.noop
    this._onClick = this.noop

    if (p.location === undefined) {
      console.log(
        `property location is missing from data-layout in ${this._name}`
      )
    }

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

  /**
   * The name of the block.
   */
  public get name() {
    return this._name
  }

  /**
   * The layer assigned to this block.
   */
  public get layer() {
    return this._position.layer
  }

  public set sibling(name: string) {
    this._siblings.set(name, true)
  }

  /**
   * setData sets a value for this block.
   * setData and getData provide a generic mechanism for storing and getting
   * extra data or handlers that are associated with this block.
   * @param name
   * @param value
   */
  public setData(name: string, value: any) {
    this._handlers.set(name, value)
  }

  /**
   * Returns the value set by setData for this block.
   * @param name
   */
  public getData(name: string) {
    return this._handlers.get(name)
  }
  /**
   * @Ignore
   */
  public get onMouseDown() {
    return this._onMouseDown
  }
  /**
   * @Ignore
   */
  public set onMouseDown(fn: (e: React.MouseEvent) => void) {
    this._onMouseDown = fn
  }
  /**
   * @Ignore
   */
  public get onClick() {
    return this._onClick
  }
  /**
   * @Ignore
   */
  public set onClick(fn: (e: React.MouseEvent) => void) {
    this._onClick = fn
  }

  public get zIndex() {
    return this._zIndex ? this._zIndex : 0
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

  get localParent(): Block | undefined {
    return this._localParent
  }

  set localParent(parent: Block | undefined) {
    this._localParent = parent
  }

  /**
   * touch sets the block dirty which will force its location and size to be
   * recomputed.
   */
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

  /**
   * [rect](../interfaces/irect.html) gets the position and size of the block in pixels.
   * Use update to change the blocks position and size.
   */
  public get rect() {
    this.updateRect()
    return this._cached
  }

  /**
   * sets the position and size using a [rect](../interfaces/irect.html) for the block in pixels.
   * @params r
   * The value of the [rect](../interfaces/irect.html).
   */
  public update = (r: IRect) => {
    // Takes in world coordinates
    // console.log(`Position update x: ${r.x} y: ${r.y} width: ${r.width} height: ${r.height}`)

    if (this._align && this.getRef()) {
      const align = this._align
      // Get source and self points
      const ref = this.getRef()
      if (ref) {
        const r1 = ref!.rect
        const p1 = connectPoint(r1, this._align.source)

        // Use updated r
        const p2 = connectPoint(r, align.self)

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
        container: containersize,
        viewport: viewport
      })
    }

    this.changed()
  }

  /**
   * updatePosition allows a script to update the blocks behavior. Only specified
   * properties of [data-layout](../interfaces/idatalayout.html) will be changed.
   * @param p
   */
  public updatePosition(p: IDataLayout) {
    if (!p) {
      return
    }
    this.validate(p)
    this._origin = { x: 0, y: 0 }
    if (p.origin) {
      this._origin.x = p.origin.x
      this._origin.y = p.origin.y
    }

    if (p.location === undefined && this._blockRect === {}) {
      console.log(`location is a required property for ${this._name}`)
    }
    if (p.location) {
      this._blockRect = convertInputBlockRect(p.location)
    }

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
        container: containersize,
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

  private validate(p: IDataLayout) {
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
