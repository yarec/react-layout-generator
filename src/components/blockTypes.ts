import { Unit, IGenericProps, IPoint, IOrigin, PositionRef } from '../types'
import { Block } from './block'
import { IGenerator } from '../generators/Generator'
import { UpdateHandle } from '../editors/updateHandle'
import { ExtendElement } from '../editors/extendElement'
import { UpdateParam } from '../editors/updateParam'

/**
 * IDataLayout is the property that you use to define a block in React. In React
 * you need to use the css friendly name 'data-layout'.
 *
 * ```ts
 *  <RLGLayout ... >
 *    <div data-layout={{
 *      name: '<block name>'
 *    }} >
 *      { content }
 *    </div>
 *  </RLGLayout>
 *
 * ```
 * In addition to the name you will need to add a position field if the block is
 * not already defined in a generator.
 */
export interface IDataLayout {
  /**
   * The name of the block. It must be unique within each RLGLayout. Failure
   * to be unique will result in children of RLGLayout overwriting each other.
   */
  name: string
  /**
   * IPosition specifies the rules and data needed to create a Block. If the
   * Block already exists then that block will be used. Position must be defined
   * either in a generator or when used with a child of RLGLayout.
   */
  position?: IPosition
}

/**
 * IPosition defines the location, origin, zIndex, link, transform, and editor
 * rules for elements in RLG.
 *
 * A minimal definition that completely fills its parent is:
 * ```ts
 *  <RLGLayout ... >
 *    <div data-layout={{
 *      name: '<block name>'
 *      position: {
 *        location: { left: 0, right: 0 }
 *      }
 *    }} >
 *      { content }
 *    </div>
 *  </RLGLayout>
 *
 *
 * ```
 */
export interface IPosition {
  /**
   * Specifies the location of this block. Location is position of the block
   * relative to the origin. With a default
   * origin `{x: 0, y: 0}`, the location is the `(left top)` of the rect.
   */
  location: IInputRect
  /**
   *  Specifies another block that this block is attached to.
   */
  align?: IAlign
  /**
   * Specifies a user supplied function will calculate the Position data for 'children'.
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
   * Additional transforms to add to this block. Note that you can also transform
   * the contents of a block separately. Warning do not add a style with any transforms
   * for this block. This feature is experimental and subject
   * to change.
   */
  transform?: Transform[]
}

/**
 * This interface defines the data for a block's location and size. Its data and behavior
 * is based on css properties [size-and-position](https://www.w3.org/TR/css-position-3/)
 * rules. The default units are pixels.
 */
export interface IInputRect {
  left?: number | string
  right?: number | string
  top?: number | string
  bottom?: number | string
  width?: number | string
  height?: number | string
}

/**
 * This interface defines the preprocessed IInputRect.
 * Internal use only.
 * @ignore
 */
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

/**
 * The purpose of this interface is to allow specification of links between blocks. It lets
 * you link 'this' block (called 'self') to 'source' block by name and offset. The link means that the 'this'
 * block's location is computed based on the location and size of the 'source' block.
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
