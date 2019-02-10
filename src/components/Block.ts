import { cursor } from '../editors/cursor'
import { getExtendElement, ExtendElement } from '../editors/extendElement'
import { getUpdateHandle, UpdateHandle } from '../editors/updateHandle'
import { UpdateParam } from '../editors/updateParam'
import { IGenerator } from '../generators/Generator'
import {
  IPoint,
  IOrigin,
  ISize,
  Unit,
  PositionRef,
  Rect,
  IGenericProps
} from '../types'
import { clone } from '../utils'
import { layout } from './layout'

/**
 * IDataLayout is the property that you use when defining children of RLGLayout. It
 * applies to both HTML elements and React Components. It's purpose is to
 * specify the rules and data needed to create a Block and optionally its children.
 * When specified on a child use the css friendly name 'data-layout'. If the Block
 * is already defined in a generator you just need the name in a child.
 */
export interface IDataLayout {
  /**
   * The name of the block. It must be unique within each RLGLayout. Failure
   * to be unique will result in children of RLGLayout overwriting each other.
   */
  name: string
  /**
   * IPosition includes the rules and data needed to create a Block. If the
   * Block already exists then that block will be used. Position must be defined
   * either in a generator or when used with a child of RLGLayout.
   */
  position?: IPosition
}

/**
 * The purpose of this interface is to allow specification of links between blocks. It lets
 * you link 'self' block to 'source' block by name and offset. The link means that the 'self' block
 * location is computed based on the location and size of the 'source' block.
 *
 * ```
 * ┌────────┐
 * │ source │
 * └────────o  (X: 100, y: 100)
 *          │
 *          │
 *          └─> t──────┐ (x: 0, y: 0)
 *              │ self │
 *              └──────┘
 * ```
 * In the diagram above 'self' block is linked to 'source' block
 * with the offset from 'o' to 't'.
 *
 * ```ts
 *  align: {
 *    key: 'source'
 *    offset: {x: 20, y: 30}
 *    source: {x: 100, y: 100}
 *    self: {x: 0, y: 0}
 *  }
 * ```
 */
export interface IAlign {
  /**
   * This is the name of 'source' Block (same as the name in data-layout={name: 'someName', ...)
   */
  key: string | number
  /**
   * Offset describes the x offset and y offset from the
   * handle on 'source'' block to the handle on 'self' block.
   * It goes from the connection handle on the 'source' block to
   * the connection handle on 'self' block so if the 'source' block
   * moves the 'self' block also moves.
   *
   * Note that align can be used to place 'self' block over/behind
   * 'source' block.
   */
  offset: IPoint
  /**
   * This defines the location of the connection handle on the 'source' block.
   * The units are in percent of the block size starting at the left top of the
   * block.
   */
  source: IOrigin
  /**
   * This defines the location of the connection handle on 'self'' block.
   */
  self: IOrigin
}

/**
 * IMenuItem describes a command in a menu.
 *
 * ```ts
 * const menuCommands: IMenuItem[] = [
 *     { name: 'undo', disabled: true, command: this.undo },
 *      ...
 *     { name: 'bring forward', disabled: false, command: this.bringForward }
 *  ]
 *
 * ...
 *
 * public bringForward = () => {
 *    const stacking = this.props.g.stacking();
 *    this._selected.forEach((block: Block) => {
 *      stacking.bringForward(block)
 *    });
 *    if (this._selected.size) {
 *      this.props.onUpdate();
 *    }
 * }
 * ```
 */
export interface IMenuItem {
  /**
   * This is the name of the item. If it is empty then a menu separator
   * will be displayed.
   */
  name: string
  /** If true then draw the item disabled. */
  disabled?: boolean
  /** If checked then draw the item 'on' */
  checked?: boolean
  /** This is the command to be executed when the item is selected.  */
  command?: () => void
}

export interface IEdit {
  /**
   * PositionRef specifies the part of a rectangle that can be edited.
   */
  ref: PositionRef
  /**
   * This is the name of the variable that will be stored in [Params](classes/params.html).
   * If this is not specified then edit changes will not be saved.
   */
  variable?: string
  /**
   * Optional name of a cursor. If not specified then the default cursor for this
   * PositionRef will be used.
   */
  cursor?: string
  /**
   * Optional updateHandle used to update the hit area for editing a PositionRef block.
   * If not specified then the default will be used.
   */
  updateHandle?: UpdateHandle
  /**
   * Optional extendElement used to compute the update for a block.
   * If not specified then the default will be used.
   */
  extendElement?: ExtendElement
  /**
   * If defined this function computes the data that should be stored
   * persistent storage. See [updateParamLocation](../globals.html#updateParamLocation),
   * [updateParamOffset](../globals.html#updateParamOffset),
   * [updateParamWidth](../globals.html#updateParamWidth), and
   * [updateParamHeight](../globals.html#updateParamHeight).
   *
   * If necessary you can use a custom function. If not defined then no data
   * will be stored.
   */
  updateParam?: UpdateParam
  /**
   * This is an array of custom editing options for a block.
   */
  contextMenu?: IMenuItem[]
}

/**
 * IEditor defines the edit options for a Block.
 */
export interface IEditor {
  /**
   * If set to false then the Block will not be selectable. The default is true.
   * Note that this option only allows or prevents selection, it does not effect other edit options.
   * To prevent an element from being selected or edited define this as:
   *
   * ```ts
   * editor: {
   *  selectable: false
   * }
   * ```
   *
   * The default editor allows both selection and movement of a block.
   */
  selectable?: boolean
  /**
   * This option adds custom commands to the context menu for this block.
   */
  contextMenu?: IMenuItem[]
  /**
   * IEdit lets you specify editors for a block.
   *
   * ```ts
   * edits: [
   *  {
   *    ref: PositionRef.top,
   *    variable: 'footerHeight',
   *    updateParam: updateParamHeight
   *  }
   * ]
   * ```
   */
  edits?: IEdit[]
}

/**
 * This is a user supplied function that defines a child of a block.
 *
 * The following example places the children horizontally. This implementation
 * is used in the solitaire game to distribute up to 3 cards in the 'waste'.
 *
 * ```ts
 * function positionWasteChildren(block: Block, g: Generator, index: number) {
 *  // Return a Block relative to parent block starting at position at (0, 0)
 *
 *  const cardSize = g.params().get('cardSize') as ISize;
 *  const computedCardSpacing = g.params().get('computedCardSpacing') as IPoint;
 *
 *  // These children get placed horizontally based on index
 *  const child: IPosition = {
 *   location: { x: index * computedCardSpacing.x, y: 0 },
 *   size: cardSize
 *  };
 *
 *  // This block is temp and will not be stored in blocks
 *  return new Block('temp', child, g);
 * }
 * ```
 */
export type PositionChildrenFn = (
  block: Block,
  g: IGenerator,
  index: number,
  props: IGenericProps
) => Block | undefined

// export interface IHandlers {
//   onMouseDown?: () => void
// }

/**
 * Extends IPoint to add optional unit
 */
// export type IPositionLocation =
//   IContainerXY |
//   IContainerLeftTop |
//   IContainerRightTop |
//   IContainerLeftBottom |
//   IContainerRightBottom

export interface IInputRect {
  left?: number | string
  right?: number | string
  top?: number | string
  bottom?: number | string
  width?: number | string
  height?: number | string
}

export interface IBlockRect {
  left?: number
  leftUnit?: Unit
  right?: number
  rightUnit?: Unit
  top?: number
  topUnit?: Unit
  bottom?: number
  bottomUnit?: Unit
  width?: number
  widthUnit?: Unit
  height?: number
  heightUnit?: Unit
}

// export type PositionLocation = IPositionLocation | IAlign

// const p: PositionLocation = {x: 0, y: 0}
// const p1: PositionLocation = {key: 'abc', offset: {x: 0, y: 0}, source: {x: 0, y: 0}, self: {x: 0, y: 0}}

// export interface IPositionSize {
//   width: number
//   height: number
//   unit?: Unit
// }

export interface IRotate {
  origin: IOrigin
  rotate: number | IPoint
}

export interface IScale {
  scale: number | IPoint
}

export interface ISkew {
  skew: number | IPoint
}

export type Transform = IRotate | IScale | ISkew

/**
 * IPosition defines the positioning, zIndex, and editor rules for elements in RLG.
 *
 * A minimal definition is:
 * ```ts
 *  location: { left: 0, right: 0, width: 100, height: '10%' }
 *
 * ```
 */
export interface IPosition {
  /**
   *  Specifies another block that this block is attached to.
   */
  align?: IAlign
  /**
   * Specifies the This user supplied function will calculate the Position data for 'children'.
   * It will be supplied with the index of the child and it should compute the
   * child's position returning a new Block. The child should be jsx.
   */
  positionChildren?: PositionChildrenFn
  /**
   * This defines the editor that will be available to the user when [RLGLayout
   * service](irlglayoutprops.html) property is set the ServiceOptions.edit.
   */
  editor?: IEditor
  /**
   * zIndex is the same as css z-index. The default is 0.
   *
   * If you use the editor to change the zIndex it will be stored in Params
   * using the key `${block.name}ZIndex`.
   */
  zIndex?: number
  /**
   * Origin defines the point that the location will use when positioning a
   * block. For example an origin of { x: 50, y: 50 } will center the block
   * at the specified location.
   */
  origin?: IOrigin
  /**
   * Specifies the location of this block. Location is position of the block
   * relative to the origin. With a default
   * origin `{x: 0, y: 0}`, the location is the `(left top)` of the rect.
   */
  location: IInputRect
  /**
   * Additional transforms to add to this block. Note that you can also transform
   * the contents of a block separately. Warning do not add a style with any transforms
   * for this block. This feature is experimental and subject
   * to change.
   */
  transform?: Transform[]
}

// export enum LocationOrientation {
//   xy = 1,
//   leftTop,
//   rightTop,
//   leftBottom,
//   rightBottom
// }

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

  get location() {
    return this._position.location
  }

  // get size() {
  //   return this._position.size
  // }

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

  get transform(): Transform[] | undefined {
    return this._position.transform
  }

  set transform(transform: Transform[] | undefined) {
    this._position.transform = transform
    this.transformToReactCss()
  }

  get reactTransform() {
    return this._transform
  }

  get reactTransformOrigin() {
    return this._transformOrigin
  }

  get x() {
    this.updateRect()
    return this._cached.x
  }

  get y() {
    this.updateRect()
    return this._cached.y
  }

  get localParent(): Block | undefined {
    return this._localParent
  }

  set localParent(parent: Block | undefined) {
    this._localParent = parent
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

  public setHandler(name: string, value: any) {
    this._handlers.set(name, value)
  }

  public getHandler(name: string) {
    return this._handlers.get(name)
  }

  // private _locationOrientation: LocationOrientation = LocationOrientation.xy
  private _siblings: Map<string, boolean> = new Map()
  private _name: string
  private _position: IPosition
  private _changed: boolean
  private _cached: Rect
  private _g: IGenerator
  private _localParent: Block | undefined
  private _positionChildren: PositionChildrenFn | undefined
  private _zIndex: number
  private _transform: string = ''
  private _transformOrigin: string = ''
  private _handlers: Map<string, any> = new Map()
  private _onMouseDown: (e: React.MouseEvent) => void
  private _onClick: (e: React.MouseEvent) => void

  constructor(name: string, p: IPosition, g: IGenerator) {
    // console.log(`initialize Layout ${name}`)
    this._name = name
    if (p) {
      this._position = clone(p)
    } else {
      this.position = {
        // same size as container
        location: { left: 0, top: 0 }
      }
    }
    this._g = g
    this._localParent = undefined
    this.updatePosition(this._position)
    if (this._position.zIndex) {
      this.zIndex = this._position.zIndex
    }
    this._cached = new Rect({ x: 0, y: 0, width: 0, height: 0 })
    this._changed = true
    this._positionChildren = this._position.positionChildren
    this._onMouseDown = this.noop
    this._onClick = this.noop
  }

  /**
   * Noop handler used for initialization.
   */
  public noop = () => {
    console.error('Event handler not defined')
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

  public set zIndex(value: number) {
    const params = this._g.params()
    const zIndex = params.get(`${this._name}ZIndex`) as number
    if (zIndex) {
      this._zIndex = zIndex
    } else {
      this._zIndex = value ? value : 0
    }
  }

  public get layer() {
    return this.getHandler('$layer')
  }

  public connectionHandles() {
    const align = this._position.align
    if (align) {
      const ref = this.getRef()
      if (ref) {
        const p1: IPoint = ref.fromLocation()
        const s1: ISize = ref.fromSize()

        const r1 = getConnectPoint(p1, s1, align.source)

        const p2: IPoint = this.fromLocation()
        const s2: ISize = this.fromSize()

        const r2 = getConnectPoint(p2, s2, align.self)

        return [r1, r2]
      }
    }
    return []
  }

  /**
   * Converts location to pixels
   */
  public fromLocation(): IPoint {
    // Handle align - ignore actual value of location
    if (this._position.align) {
      const ref = this.getRef()
      if (ref) {
        const p: IPoint = ref.fromLocation()
        const s: ISize = ref.fromSize()
        const source: IPoint = toAlign(p, s, this._position.align.source)
        const offset: IPoint = {
          x: source.x + this._position.align.offset.x,
          y: source.y + this._position.align.offset.y
        }
        return fromAlign(offset, this.fromSize(), this._position.align.self)
      }
    }

    const containersize = this._g.params().get('containersize') as ISize
    const viewport = this._g.params().get('viewport') as ISize
    const point = layout(this._position.location, {
      local: containersize,
      viewport: viewport
    })

    if (this._position.origin) {
      return fromOrigin(point, this._position.origin, this.fromSize())
    }
    return point
  }

  /**
   * Converts size to pixels
   */
  public fromSize() {
    // console.log('size ' + this._position.size.width)
    const containersize = this._g.params().get('containersize') as ISize
    return scaleSize(this._position.size, containersize)
  }

  public rect(force?: boolean) {
    this.updateRect(force)
    return this._cached
  }

  public touch() {
    this.changed()
  }

  /**
   * Change the block state
   */
  public update(location: IPoint, size?: ISize) {
    // Takes in world coordinates
    // console.log(`Position update x: ${location.x} y: ${location.y}`)

    const _location: IInputRect = {
      ...location,
      unit: this._position.location.unit
    }

    const _itemSize: IPositionSize = {
      ...(size ? size : this.fromSize()),
      unit: this._position.size.unit
    }

    const containersize = this._g.params().get('containersize') as ISize

    if (this._position.align && this.getRef()) {
      const align = this._position.align
      // Get source and self points
      const ref = this.getRef()
      const p1: IPoint = ref!.fromLocation()
      const s1: ISize = ref!.fromSize()

      const r1 = getConnectPoint(p1, s1, align.source)

      const p = toOrigin(_location, this._position.origin, _itemSize)
      // const p2 = this.inverseScale(p, this._position.units.location) as IPoint;

      const s2 = inverseScaleSize(_itemSize, containersize) as ISize

      const r2 = getConnectPoint(p, s2, align.self)

      // Compute new offset
      const offset: IPoint = {
        x: r2.x - r1.x,
        y: r2.y - r1.y
      }

      // Update align offset
      align.offset = offset
    } else {
      const p = toOrigin(_location, this._position.origin, _itemSize)
      this._position.location = pixelToLocation(
        p,
        this._position.location.unit,
        this._locationOrientation,
        containersize
      ) as IInputRect
      this._position.size = inverseScaleSize(
        _itemSize,
        containersize
      ) as IPositionSize
    }

    this.changed()
  }

  public updateSize(size: IPositionSize) {
    // Takes in world coordinates
    const containersize = this._g.params().get('containersize') as ISize
    this._position.size = inverseScaleSize(size, containersize) as ISize
    this.changed()
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

  private updateRect(force: boolean = false) {
    if (this._changed || force) {
      this._changed = false
      const value = { ...this.fromLocation(), ...this.fromSize() }
      this._cached.update({
        x: value.x,
        y: value.y,
        width: value.width,
        height: value.height
      })
    }
  }

  public validate(p: IPosition) {
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

  public updatePosition(p: IPosition) {
    this.validate(p)
    if (this._position.origin && p.origin) {
      this._position.origin.x = p.origin.x * 0.01
      this._position.origin.y = p.origin.y * 0.01
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

    this.transformToReactCss()

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
}

// /**
//  * Take unit and convert to real world
//  */
// export function scale(input: IPositionLocation, containerSize: ISize): IPoint {
//   switch (input.unit) {
//     case Unit.percent: {
//       if ('x' in input) {
//         const p = input as IPoint
//         return {
//           x: p.x * containerSize.width,
//           y: p.y * containerSize.height
//         }
//       }
//       break
//     }
//     case Unit.preserve: {
//       const minWidth = containerSize.width < containerSize.height ? containerSize.width : containerSize.height

//       if ('x' in input) {
//         const p = input as IPoint
//         return {
//           x: p.x * minWidth,
//           y: p.y * minWidth
//         }
//       }/*  else {
//         const s = input as ISize
//         return {
//           width: s.width * minWidth,
//           height: s.height * minWidth
//         }
//       } */
//       break
//     }
//     case Unit.preserveWidth: {
//       const factor = containerSize.width

//       if ('x' in input) {
//         const p = input as IPoint
//         return {
//           x: p.x * factor,
//           y: p.y * factor
//         }
//       } /* else {
//         const s = input as ISize
//         return {
//           width: s.width * factor,
//           height: s.height * factor
//         }
//       } */
//       break
//     }
//     case Unit.preserveHeight: {
//       const factor = containerSize.height

//       if ('x' in input) {
//         const p = input as IPoint
//         return {
//           x: p.x * factor,
//           y: p.y * factor
//         }
//       } /* else {
//         const s = input as ISize
//         return {
//           width: s.width * factor,
//           height: s.height * factor
//         }
//       } */
//       break
//     }
//   }
//   // default no translation needed
//   return {x: input.x, y:
// }

/**
 * Take unit and convert to real world
 */
export function scaleSize(
  input: IPositionSize,
  containersize: ISize
): IPositionSize {
  switch (input.unit) {
    case Unit.percent: {
      const s = input as ISize
      return {
        width: s.width * containersize.width,
        height: s.height * containersize.height
      }
      break
    }
    case Unit.vmin: {
      const minWidth =
        containersize.width < containersize.height
          ? containersize.width
          : containersize.height
      const s = input as ISize
      return {
        width: s.width * minWidth,
        height: s.height * minWidth
      }
      break
    }
    case Unit.vw: {
      const factor = containersize.width
      const s = input as ISize
      return {
        width: s.width * factor,
        height: s.height * factor
      }
      break
    }
    case Unit.vh: {
      const factor = containersize.height
      const s = input as ISize
      return {
        width: s.width * factor,
        height: s.height * factor
      }
      break
    }
  }
  // default no translation needed
  return input
}

/**
 * Take pixels and convert to percent
 */
export function inverseScaleSize(
  input: IPositionSize,
  containerSize: ISize
): IPositionSize {
  switch (input.unit) {
    case Unit.percent: {
      if (containerSize.width && containerSize.height) {
        const s = input as IPositionSize
        return {
          width: s.width / containerSize.width,
          height: s.height / containerSize.height,
          unit: s.unit
        }
      }
      break
    }
    case Unit.vmin: {
      const minWidth =
        containerSize.width < containerSize.height
          ? containerSize.width
          : containerSize.height
      if (minWidth) {
        const s = input as IPositionSize
        return {
          width: s.width / minWidth,
          height: s.height / minWidth,
          unit: s.unit
        }
      }
      break
    }
    case Unit.vw: {
      const factor = containerSize.width
      if (factor) {
        const s = input as IPositionSize
        return {
          width: s.width / factor,
          height: s.height / factor,
          unit: s.unit
        }
      }
      break
    }
    case Unit.vh: {
      const factor = containerSize.height
      if (factor) {
        const s = input as IPositionSize
        return {
          width: s.width / factor,
          height: s.height / factor,
          unit: s.unit
        }
      }
      break
    }
  }

  // default
  return input
}

export function getConnectPoint(l: IPoint, s: ISize, a: IOrigin) {
  return { x: l.x + s.width * a.x, y: l.y + s.height * a.y }
}

// /**
//  * Take pixels and convert to percent
//  */
// export function inverseScale(
//   input: IPositionLocation,
//   containerSize: ISize
// ): IPositionLocation {
//   switch (input.unit) {
//     case Unit.percent: {
//       if (containerSize.width && containerSize.height) {
//         if ('x' in input) {
//           const p = input as IPositionLocation
//           return {
//             x: p.x / containerSize.width,
//             y: p.y / containerSize.height,
//             unit: p.unit
//           }
//         }
//       }
//       break
//     }
//     case Unit.preserve: {
//       const minWidth = containerSize.width < containerSize.height ? containerSize.width : containerSize.height
//       if (minWidth) {
//         if ('x' in input) {
//           const p = input as IPositionLocation
//           return {
//             x: p.x / minWidth,
//             y: p.y / minWidth,
//             unit: p.unit
//           }
//         }
//       }
//       break
//     }
//     case Unit.preserveWidth: {

//       const factor = containerSize.width
//       if (factor) {
//         if ('x' in input) {
//           const p = input as IPositionLocation
//           return {
//             x: p.x / factor,
//             y: p.y / factor,
//             unit: p.unit
//           }
//         }
//       }
//       break
//     }
//     case Unit.preserveHeight: {
//       const factor = containerSize.height
//       if (factor) {
//         if ('x' in input) {
//           const p = input as IPositionLocation
//           return {
//             x: p.x / factor,
//             y: p.y / factor,
//             unit: p.unit
//           }
//         }
//       }
//       break
//     }
//   }

//   // default
//   return input
// }

/**
 * Compute left top point of rectangle based on align value
 * If p represents the bottom center point then the top left
 * position is (p.x - s.x / 2, p.y - s.y;)
 * Inverse of toAlign.
 */
export function fromAlign(p: IPoint, s: ISize, origin: IOrigin): IPoint {
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
export function toAlign(p: IPoint, s: ISize, align: IOrigin): IPoint {
  return {
    x: p.x + align.x * s.width,
    y: p.y + align.y * s.height
  }
}

/**
 * Computes location point given the pixel location
 */
export function pixelToLocation(
  pixel: IPoint,
  unit: Unit | undefined,
  orientation: LocationOrientation,
  containerSize: ISize
): IInputRect {
  switch (orientation) {
    case LocationOrientation.xy: {
      return {
        x: pixelXToLocation(pixel.x, unit ? unit : Unit.pixel, containerSize),
        y: pixelYToLocation(pixel.y, unit ? unit : Unit.pixel, containerSize),
        unit: unit
      }
      break
    }
    case LocationOrientation.leftTop: {
      return {
        left: pixelXToLocation(
          pixel.x,
          unit ? unit : Unit.pixel,
          containerSize
        ),
        top: pixelYToLocation(pixel.y, unit ? unit : Unit.pixel, containerSize),
        unit: unit
      }
      break
    }
    case LocationOrientation.rightTop: {
      return {
        x:
          containerSize.width -
          pixelXToLocation(pixel.x, unit ? unit : Unit.pixel, containerSize),
        y: pixelYToLocation(pixel.y, unit ? unit : Unit.pixel, containerSize)
      }
      break
    }
    case LocationOrientation.leftBottom: {
      return {
        x: pixelXToLocation(pixel.x, unit ? unit : Unit.pixel, containerSize),
        y:
          containerSize.height -
          pixelYToLocation(pixel.y, unit ? unit : Unit.pixel, containerSize)
      }
      break
    }
    case LocationOrientation.rightBottom: {
      return {
        x:
          containerSize.width -
          pixelXToLocation(pixel.x, unit ? unit : Unit.pixel, containerSize),
        y:
          containerSize.height -
          pixelYToLocation(pixel.y, unit ? unit : Unit.pixel, containerSize)
      }
      break
    }
  }
  return {
    x: NaN,
    y: NaN
  }
}

/**
 * Computes the pixel offset on the Y axis.
 * @param value
 * @param unit
 * @param containerSize
 */
export function pixelXToLocation(
  value: number,
  unit: Unit,
  containerSize: ISize
) {
  switch (unit) {
    case Unit.percent: {
      return value * containerSize.height
    }
    case Unit.vmin: {
      const minWidth =
        containerSize.width < containerSize.height
          ? containerSize.width
          : containerSize.height
      return value * minWidth
      break
    }
    case Unit.vw: {
      return value * containerSize.width
    }
    case Unit.vh: {
      return value * containerSize.height
    }
  }

  return value
}

/**
 * Computes the pixel offset on the Y axis.
 * @param value
 * @param unit
 * @param containerSize
 */
export function pixelYToLocation(
  value: number,
  unit: Unit,
  containerSize: ISize
): number {
  switch (unit) {
    case Unit.percent: {
      return value * containerSize.width
    }
    case Unit.vmin: {
      const minWidth =
        containerSize.width < containerSize.height
          ? containerSize.width
          : containerSize.height
      return value * minWidth
      break
    }
    case Unit.vw: {
      return value * containerSize.width
    }
    case Unit.vh: {
      return value * containerSize.height
    }
  }

  return value
}

/**
 * Computes the pixel offset on the Y axis.
 * @param value
 * @param unit
 * @param containerSize
 */
export function locationXToPixel(
  value: number,
  unit: Unit,
  containerSize: ISize
): number {
  switch (unit) {
    case Unit.percent: {
      return value * containerSize.width
    }
    case Unit.vmin: {
      const minWidth =
        containerSize.width < containerSize.height
          ? containerSize.width
          : containerSize.height
      return value * minWidth
      break
    }
    case Unit.vw: {
      return value * containerSize.width
    }
    case Unit.vh: {
      return value * containerSize.height
    }
  }

  return value
}
