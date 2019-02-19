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
