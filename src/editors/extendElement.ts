import { PositionRef, IEdit } from '../components/Layout';
import { Rect, IRect } from '../types'
export type ExtendElement = (rect: IRect, deltaX: number, deltaY: number) => IRect

export default function getExtendElement(edit: IEdit): ExtendElement {
  let extendElement: ExtendElement = (r: IRect, deltaX: number, deltaY: number) => { 
    return { x: r.x, y: r.y, width: r.width, height: r.height } 
  };

  switch (edit.ref) {
    case PositionRef.position: {
      // use default
      break;
    }
    case PositionRef.left: {
      extendElement = (r: Rect) => {
        return { x: r.x - 2, y: r.y, width: 4, height: r.height };
      }
      break;
    }
    case PositionRef.right: {
      extendElement = (r: Rect) => {
        return { x: r.x + r.width - 2, y: r.y, width: 4, height: r.height };
      }
      break;
    }
    case PositionRef.top: {
      extendElement = (r: Rect) => {
        return {x: r.x, y: r.y - 2, width: r.width, height: 4 };
      }
      break;
    }
    case PositionRef.bottom: {
      extendElement = (r: Rect) => {
        return {x: r.x, y: r.y + r.height - 2, width: r.width, height: 4 };
      }
      break;
    }
    case PositionRef.leftTop: {
      extendElement = (r: Rect) => {
        return {x: r.x - 2, y: r.y - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.rightTop: {
      extendElement = (r: Rect) => {
        return {x: r.x + r.width - 2, y: r.y - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.leftBottom: {
      extendElement = (r: Rect) => {
        return {x: r.x - 2, y: r.y + r.height - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.rightBottom: {
      extendElement = (r: Rect) => {
        return {x: r.x + r.width - 2, y: r.y + r.height - 2, width: 4, height: 4 };
      }
      break;
    }
    default: {
      console.error(`Invalid PositionRef ${edit.ref}`);
      break;
    }
  }
  return extendElement;
}