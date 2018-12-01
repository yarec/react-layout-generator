import { IEdit, PositionRef } from '../components/Layout';

export function cursor(edit: IEdit) {
  let c: string = 'default';
  switch (edit.ref) {
    case PositionRef.position: {
      c = 'move';
      break;
    }
    case PositionRef.left: {
      c = 'w-resize';
      break;
    }
    case PositionRef.right: {
      c = 'w-resize';
      break;
    }
    case PositionRef.top: {
      c = 'n-resize';
      break;
    }
    case PositionRef.bottom: {
      c = 'n-resize';
      break;
    }
    case PositionRef.leftTop: {
      c = 'nw-resize';
      break;
    }
    case PositionRef.rightTop: {
      c = 'ne-resize';
      break;
    }
    case PositionRef.leftBottom: {
      c = 'nw-resize';
      break;
    }
    case PositionRef.rightBottom: {
      c = 'ne-resize';
      break;
    }
    default: {
      console.error(`Invalid PositionRef in cursor ${edit.ref}`);
      break;
    }
  }
  return c;
}