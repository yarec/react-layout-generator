"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(aObject) {
    if (!aObject) {
        return aObject;
    }
    var bObject = Array.isArray(aObject) ? [] : {};
    for (var k in aObject) {
        if (k) {
            var v = aObject[k];
            bObject[k] = (typeof v === "object") ? clone(v) : v;
        }
    }
    return bObject;
}
exports.clone = clone;
//# sourceMappingURL=utils.js.map