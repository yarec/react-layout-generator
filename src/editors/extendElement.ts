import { IEdit, PositionRef } from '../components/Layout';
import { IRect, Rect } from '../types'
export type ExtendElement = (rect: IRect, deltaX: number, deltaY: number) => IRect

export default function getExtendElement(edit: IEdit): ExtendElement {
  let extendElement: ExtendElement = (r: IRect, deltaX: number, deltaY: number) => { 
    return { x: r.x + deltaX, y: r.y + deltaY, width: r.width, height: r.height } 
  };

  switch (edit.ref) {
    case PositionRef.position: {
      // use default
      break;
    }
    case PositionRef.left: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        // console.log('extendElement left', r.x,  r.width, deltaX)
        return { x: r.x + deltaX, y: r.y, width: r.width - deltaX, height: r.height };
      }
      break;
    }
    case PositionRef.right: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return { x: r.x, y: r.y, width: r.width + deltaX, height: r.height };
      }
      break;
    }
    case PositionRef.top: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return {x: r.x, y: r.y + deltaY, width: r.width, height: r.height - deltaY };
      }
      break;
    }
    case PositionRef.bottom: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return {x: r.x, y: r.y, width: r.width, height: r.height + deltaY };
      }
      break;
    }
    case PositionRef.leftTop: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return {x: r.x - deltaX, y: r.y - deltaY, width: r.width + deltaX, height: r.height + deltaY };
      }
      break;
    }
    case PositionRef.rightTop: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return {x: r.x, y: r.y - deltaY, width: r.width + deltaX, height: r.height + deltaY };
      }
      break;
    }
    case PositionRef.leftBottom: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return {x: r.x - deltaX, y: r.y, width: r.width + deltaX, height: r.height + deltaY };
      }
      break;
    }
    case PositionRef.rightBottom: {
      extendElement = (r: Rect, deltaX: number, deltaY: number) => {
        return {x: r.x, y: r.y - deltaY, width: r.width + deltaX, height: r.height + deltaY };
      }
      break;
    }
    default: {
      console.error(`Invalid PositionRef in ExtendElement ${edit.ref}`);
      break;
    }
  }
  return extendElement;
}