// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

export { RLGLayout, IRLGLayoutProps } from './RLGLayout'
export { RLGPanel, IRLGMetaDataArgs } from './RLGPanel'
export { Draggable, IDraggableProps } from './Draggable'
export { DragDrop, IDragDropProps } from './DragDrop'
export { Block } from './components/Block'
export {
  IAlign,
  IEdit,
  IEditor,
  IInputRect,
  IMenuItem,
  IPosition,
  IBlockRect as IPositionLocation,
  IRotate,
  IScale,
  ISkew,
  PositionChildrenFn as PositionChildren,
  Transform
} from './components/blockTypes'

export {
  Unit,
  DebugOptions,
  ServiceOptions,
  IGenericProps,
  ILayerOptions,
  ISize,
  IPoint,
  IOrigin,
  IRect,
  OverflowOptions,
  PositionRef,
  rectPoint,
  rectSize
} from './types'

export { toPixel } from './components/blockUtils'

export {
  EditHelper,
  IEditTool,
  IEditHelperProps,
  Status
} from './editors/EditHelper'
export { columnsGenerator } from './generators/columnsGenerator'
export { desktopGenerator } from './generators/desktopGenerator'
export { dynamicGenerator } from './generators/dynamicGenerator'
export {
  Generator,
  ICreate,
  IGenerator,
  IGeneratorFunctionArgs
} from './generators/Generator'

export { rowsGenerator } from './generators/rowsGenerator'
export { rollGenerator } from './generators/animations/rollGenerator'
export { rollHook } from './generators/animations/rollHook'

export { saveToLocalStorage, loadFromLocalStorage } from './generators/utils'

export {
  updateParamLocation,
  updateParamHeight,
  updateParamOffset,
  updateParamWidth
} from './editors/update'

export { Blocks } from './components/Blocks'
export { IEditableTextData, Params, ParamValue } from './components/Params'

//
