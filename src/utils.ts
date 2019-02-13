export function clone(aObject: any) {
  if (!aObject) {
    return aObject
  }

  const bObject = Array.isArray(aObject) ? [] : {}
  for (const k in aObject) {
    if (k) {
      const v = aObject[k]
      bObject[k] = typeof v === 'object' ? clone(v) : v
    }
  }
  return bObject
}

// export function add(v1: IValue, v2: IValue, containersize: ISize) {
//   const p1 = toPixel(v1, containersize)
//   const p2 = toPixel(v2, containersize)

//   if ('x' in p1 && 'x' in p2) {
//     return {
//       x: p1.x + p2.x,
//       y: p1.y + p2.y
//     }
//   }
//   if ('width' in p1 && 'width' in p2) {
//     return {
//       width: p1.width + p2.width,
//       height: p1.height + p2.height
//     }
//   }

//   return {
//     x: NaN,
//     y: NaN
//   }
// }
