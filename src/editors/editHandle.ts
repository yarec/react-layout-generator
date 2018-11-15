import { IEdit, PositionRef } from '../components/Layout';
import { Rect, IRect } from '../types'
export type EditHandle = (rect: Rect) => IRect

export default function getEditHandle(edit: IEdit): EditHandle {
  let handle: EditHandle = (r: Rect) => { 
    return { x: r.x, y: r.y, width: r.width, height: r.height } 
  };

  switch (edit.ref) {
    case PositionRef.position: {
      // use default
      break;
    }
    case PositionRef.left: {
      handle = (r: Rect) => {
        return { x: r.x - 2, y: r.y, width: 4, height: r.height };
      }
      break;
    }
    case PositionRef.right: {
      handle = (r: Rect) => {
        return { x: r.x + r.width - 2, y: r.y, width: 4, height: r.height };
      }
      break;
    }
    case PositionRef.top: {
      handle = (r: Rect) => {
        return {x: r.x, y: r.y - 2, width: r.width, height: 4 };
      }
      break;
    }
    case PositionRef.bottom: {
      handle = (r: Rect) => {
        return {x: r.x, y: r.y + r.height - 2, width: r.width, height: 4 };
      }
      break;
    }
    case PositionRef.leftTop: {
      handle = (r: Rect) => {
        return {x: r.x - 2, y: r.y - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.rightTop: {
      handle = (r: Rect) => {
        return {x: r.x + r.width - 2, y: r.y - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.leftBottom: {
      handle = (r: Rect) => {
        return {x: r.x - 2, y: r.y + r.height - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.rightBottom: {
      handle = (r: Rect) => {
        return {x: r.x + r.width - 2, y: r.y + r.height - 2, width: 4, height: 4 };
      }
      break;
    }
    default: {
      console.error(`Invalid PositionRef ${edit.ref}`);
      break;
    }
  }
  return handle;
}