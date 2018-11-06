// import { IPosition, IRect, IUnit, IOrigin } from './types';
// import {Layouts} from './LayoutGenerator';

// export function positionToRect(position: IPosition, width: number, height: number): IRect {

//   let top = position.location.y;
//   let left = position.location.x;

//   let sizeWidth = position.size.x;
//   let sizeHeight = position.size.y;

//   if (position.units.size === IUnit.percent) {
//     sizeHeight = position.size.y * height / 100;
//     sizeWidth = position.size.x * width / 100;
//   }

//   if (position.units.location === IUnit.percent) {
//     top = position.location.y * height / 100
//     left = position.location.x * width / 100;
//   }

//   if (position.units.origin === IOrigin.center) {
//     top -= sizeHeight / 2;
//     left -= sizeWidth / 2;
//   }

//   return {
//     top: top,
//     left: left,
//     bottom: top + sizeHeight,
//     right: left + sizeWidth
//   }
// }

// export function rectToPosition(rect: IRect, width: number, height: number, units: {origin: IOrigin, location: IUnit, size: IUnit} ): IPosition {
//   let xo = rect.left;
//   let yo = rect.top;
//   if (units.origin === IOrigin.center) {
//     xo += (rect.right - rect.left) / 2;
//     yo += (rect.bottom - rect.top) / 2;
//   }

//   if(units.location === IUnit.percent) {
//     xo = xo / width * 100;
//     yo = yo / height * 100;
//   }

//   let xs = rect.right - rect.left;
//   let ys = rect.bottom - rect.top;
//   if(units.size === IUnit.percent) {
//     xs = xs / width * 100;
//     ys = ys / height * 100;
//   }

//   return {
//     units: units,
//     location: {
//       x: xo,
//       y: yo
//     },
//     size: {
//       x: xs,
//       y: ys
//     }
//   }
// }