import { PositionRef, IEdit } from '../components/Layout';

export function cursor(edit: IEdit) {
  let cursor: string = 'default';
  switch (edit.ref) {
    case PositionRef.position: {
      cursor = 'move';
      break;
    }
    case PositionRef.left: {
      cursor = 'w-resize';
      break;
    }
    case PositionRef.right: {
      cursor = 'w-resize';
      break;
    }
    case PositionRef.top: {
      cursor = 'n-resize';
      break;
    }
    case PositionRef.bottom: {
      cursor = 'w-resize';
      break;
    }
    case PositionRef.leftTop: {
      cursor: 'nw-resize';
      break;
    }
    case PositionRef.rightTop: {
      cursor: 'ne-resize';
      break;
    }
    case PositionRef.leftBottom: {
      cursor: 'nw-resize';
      break;
    }
    case PositionRef.rightBottom: {
      cursor: 'ne-resize';
      break;
    }
    default: {
      console.error(`Invalid PositionRef in cursor ${edit.ref}`);
      break;
    }
  }
  return cursor;
}