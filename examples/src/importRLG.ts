/***
 * The following direct imports allow seemless debugging of 
 * react-layout-generator in typescript.
 * 
 * Comment this section out to use the nmp library locally
 * This is a manual process because js does not allow macros
 */

 
export { RLGLayout } from '../../src/RLGLayout'
export { RLGPanel, IRLGMetaDataArgs } from '../../src/RLGPanel'
export { Draggable } from '../../src/Draggable'
export { Droppable } from '../../src/Droppable'

export {IPositionLocation, IPositionSize} from '../../src/components/Block'

export {
  Unit,
  DebugOptions,
  ServiceOptions,
  ISize,
  IPoint,
  IOrigin,
  OverflowOptions,
  IRect,
  PositionRef,
  Props,
  rectPoint,
  rectSize
} from '../../src/types'
export { toPixel, toPercent } from '../../src/utils'

export { EditHelper, IEditTool, IEditHelperProps, Status } from '../../src/editors/EditHelper'
export { columnsGenerator } from '../../src/generators/columnsGenerator'
export { desktopGenerator } from '../../src/generators/desktopGenerator'
export { dynamicGenerator } from '../../src/generators/dynamicGenerator'
export {
  Generator,
  ICreate,
  IGenerator,
  IGeneratorFunctionArgs
} from '../../src/generators/Generator'
export { rowsGenerator } from '../../src/generators/rowsGenerator'
export { rollGenerator } from '../../src/generators/animations/rollGenerator'

export { saveToLocalStorage, loadFromLocalStorage } from '../../src/generators/utils'

export {
  updateParamLocation,
  updateParamHeight,
  updateParamOffset,
  updateParamWidth
} from '../../src/editors/update'

export { Block, IPosition } from '../../src/components/Block'
export { Blocks } from '../../src/components/Blocks'
export { IEditableTextData, Params, ParamValue } from '../../src/components/Params'

/***
 * The following npm local imports allow testing of the npm library
 * 
 * Comment this section out to use direct imports for debugging
 * This is a manual process because js does not allow macros
 */
// export {
//   Block,
//   Blocks,
//   DebugOptions,
//   desktopGenerator,
//   dynamicGenerator,
//   EditHelper,
//   ServiceOptions,
//   Generator,
//   ICreate,
//   IEditTool,
//   IEditHelperProps,
//   IGenerator,
//   IPoint,
//   IPosition,
//   IRLGMetaDataArgs,
//   ISize,
//   IRect,
//   loadFromLocalStorage,
//   Params,
//   ParamValue, 
//   PositionRef,
//   rectSize,
//   RLGLayout,
//   RLGPanel,
//   rowsGenerator,
//   saveToLocalStorage,  
//   Status,
//   toPixel,  
//   Unit,
//   updateParamLocation
// } from 'react-layout-generator'