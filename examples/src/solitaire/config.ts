import RLGDynamic from '../../../src/generators/RLGDynamic';

import { IPoint } from '../../../src/types';

/**
 * Values below are in percent for a responsive layout
 */

export const stockPosition: IPoint = { x: 10, y: 10 }
export const wastePosition: IPoint = { x: 20, y: 10 }
export const foundationPosition: IPoint = { x: 40, y: 10 }
export const tableauPosition: IPoint = { x: 20, y: 30 }

export const cardWidth: number = 9;
export const cardHeight: number = 12
export const cardVerticalOffset: number = 1;
export const cardHorizontalOffset: number = 1.3;
export const foundationStackSpacing: number = 2;
export const tableauStackSpacing: number = 2;

export const gameGenerator = RLGDynamic('examples.solitaire');
export const stockGenerator = RLGDynamic('examples.solitaire.stock', gameGenerator);
export const wasteGenerator = RLGDynamic('examples.solitaire.waste', gameGenerator);

export const foundationGenerator = RLGDynamic('examples.solitaire.foundation', gameGenerator);
export const foundationStack1Generator = RLGDynamic('examples.solitaire.foundation.stack1', foundationGenerator);
export const foundationStack2Generator = RLGDynamic('examples.solitaire.foundation.stack2', foundationGenerator);
export const foundationStack3Generator = RLGDynamic('examples.solitaire.foundation.stack3', foundationGenerator);
export const foundationStack4Generator = RLGDynamic('examples.solitaire.foundation.stack4', foundationGenerator);

export const tableauGenerator = RLGDynamic('examples.solitaire.tableau', gameGenerator);
export const tableauStack1Generator = RLGDynamic('examples.solitaire.foundation.stack1', tableauGenerator);
export const tableauStack2Generator = RLGDynamic('examples.solitaire.foundation.stack2', tableauGenerator);
export const tableauStack3Generator = RLGDynamic('examples.solitaire.foundation.stack3', tableauGenerator);
export const tableauStack4Generator = RLGDynamic('examples.solitaire.foundation.stack4', tableauGenerator);
export const tableauStack5Generator = RLGDynamic('examples.solitaire.foundation.stack2', tableauGenerator);
export const tableauStack6Generator = RLGDynamic('examples.solitaire.foundation.stack3', tableauGenerator);
export const tableauStack7Generator = RLGDynamic('examples.solitaire.foundation.stack4', tableauGenerator);