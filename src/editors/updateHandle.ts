import { IEdit, PositionRef } from '../components/Layout';
import { IRect } from '../types'
export type UpdateHandle = (rect: IRect) => IRect

export default function getUpdateHandle(edit: IEdit): UpdateHandle {
  let handle: UpdateHandle = (r: IRect) => { 
    return { x: r.x, y: r.y, width: r.width, height: r.height } 
  };

  switch (edit.ref) {
    case PositionRef.position: {
      // use default
      break;
    }
    case PositionRef.left: {
      handle = (r: IRect) => {
        return { x: r.x - 2, y: r.y, width: 4, height: r.height };
      }
      break;
    }
    case PositionRef.right: {
      handle = (r: IRect) => {
        return { x: r.x + r.width - 2, y: r.y, width: 4, height: r.height };
      }
      break;
    }
    case PositionRef.top: {
      handle = (r: IRect) => {
        return {x: r.x, y: r.y - 2, width: r.width, height: 4 };
      }
      break;
    }
    case PositionRef.bottom: {
      handle = (r: IRect) => {
        return {x: r.x, y: r.y + r.height - 2, width: r.width, height: 4 };
      }
      break;
    }
    case PositionRef.leftTop: {
      handle = (r: IRect) => {
        return {x: r.x - 2, y: r.y - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.rightTop: {
      handle = (r: IRect) => {
        return {x: r.x + r.width - 2, y: r.y - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.leftBottom: {
      handle = (r: IRect) => {
        return {x: r.x - 2, y: r.y + r.height - 2, width: 4, height: 4 };
      }
      break;
    }
    case PositionRef.rightBottom: {
      handle = (r: IRect) => {
        return {x: r.x + r.width - 2, y: r.y + r.height - 2, width: 4, height: 4 };
      }
      break;
    }
    default: {
      console.error(`Invalid PositionRef in UpdateHandle ${edit.ref}`);
      break;
    }
  }
  return handle;
}