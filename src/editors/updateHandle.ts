import { IEdit, PositionRef } from '../components/Layout'
import { IRect } from '../types'
export type UpdateHandle = (rect: IRect) => IRect

const handleWidth = 6
const halfHandleWidth = 3

export default function getUpdateHandle(edit: IEdit): UpdateHandle {
  let handle: UpdateHandle = (r: IRect) => {
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }

  switch (edit.ref) {
    case PositionRef.none: {
      // use default
      break
    }
    case PositionRef.position: {
      // use default
      break
    }
    case PositionRef.left: {
      handle = (r: IRect) => {
        return {
          x: r.x - halfHandleWidth,
          y: r.y,
          width: handleWidth,
          height: r.height
        }
      }
      break
    }
    case PositionRef.right: {
      handle = (r: IRect) => {
        return {
          x: r.x + r.width - halfHandleWidth,
          y: r.y,
          width: handleWidth,
          height: r.height
        }
      }
      break
    }
    case PositionRef.top: {
      handle = (r: IRect) => {
        return {
          x: r.x,
          y: r.y - halfHandleWidth,
          width: r.width,
          height: handleWidth
        }
      }
      break
    }
    case PositionRef.bottom: {
      handle = (r: IRect) => {
        return {
          x: r.x,
          y: r.y + r.height - halfHandleWidth,
          width: r.width,
          height: handleWidth
        }
      }
      break
    }
    case PositionRef.leftTop: {
      handle = (r: IRect) => {
        return {
          x: r.x - halfHandleWidth,
          y: r.y - halfHandleWidth,
          width: handleWidth,
          height: handleWidth
        }
      }
      break
    }
    case PositionRef.rightTop: {
      handle = (r: IRect) => {
        return {
          x: r.x + r.width - halfHandleWidth,
          y: r.y - halfHandleWidth,
          width: handleWidth,
          height: handleWidth
        }
      }
      break
    }
    case PositionRef.leftBottom: {
      handle = (r: IRect) => {
        return {
          x: r.x - halfHandleWidth,
          y: r.y + r.height - halfHandleWidth,
          width: handleWidth,
          height: handleWidth
        }
      }
      break
    }
    case PositionRef.rightBottom: {
      handle = (r: IRect) => {
        return {
          x: r.x + r.width - halfHandleWidth,
          y: r.y + r.height - halfHandleWidth,
          width: handleWidth,
          height: handleWidth
        }
      }
      break
    }
    default: {
      console.error(`Invalid PositionRef in UpdateHandle ${edit.ref}`)
      break
    }
  }
  return handle
}
