
export function clone(aObject: any) {
  if (!aObject) {
    return aObject;
  }

  var bObject, v, k;
  bObject = Array.isArray(aObject) ? [] : {};
  for (k in aObject) {
    v = aObject[k];
    bObject[k] = (typeof v === "object") ? clone(v) : v;
  }
  return bObject;
}