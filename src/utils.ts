import {IPosition, IRect} from './types';

export function positionToRect(position: IPosition, width: number, height: number): IRect {
  const top = position.location.y * height / 100 - (position.size.y / 2);
  const left = position.location.x * width / 100 - (position.size.x / 2);
  // console.log('computePosition')
  return {
    top: top,
    left: left,
    bottom: top + position.size.y,
    right: left + position.size.x
  }
}

export function rectToPosition(rect: IRect, width: number, height: number): IPosition {
  const xc = rect.left + (rect.right - rect.left) / 2;
  const yc = rect.top + (rect.bottom - rect.top) / 2;
  return {
    location: {
      x: xc / width * 100,
      y: yc / height * 100
    },
    size: {
      x: rect.right - rect.left,
      y: rect.bottom - rect.top
    }
  }
}