"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("./components/Layout");
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
var PixelPoint = (function () {
    function PixelPoint(p) {
        this._p = p;
    }
    PixelPoint.prototype.toPercent = function (containersize) {
        return {
            x: this._p.x / containersize.width,
            y: this._p.y / containersize.height
        };
    };
    return PixelPoint;
}());
exports.PixelPoint = PixelPoint;
function toPixel(v, containersize) {
    switch (v.unit) {
        case Layout_1.IUnit.pixel: {
            return v.value;
            break;
        }
        case Layout_1.IUnit.percent: {
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / 100) * containersize.width,
                    y: (p.y / 100) * containersize.height
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / 100) * containersize.width,
                    y: (s.height / 100) * containersize.height
                };
            }
            break;
        }
        case Layout_1.IUnit.preserve: {
            var factor = (containersize.height < containersize.width) ? containersize.height : containersize.width;
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / 100) * factor,
                    y: (p.y / 100) * factor
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / 100) * factor,
                    y: (s.height / 100) * factor
                };
            }
            break;
        }
        case Layout_1.IUnit.preserveWidth: {
            var factor = containersize.width;
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / 100) * factor,
                    y: (p.y / 100) * factor
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / 100) * factor,
                    y: (s.height / 100) * factor
                };
            }
            break;
        }
        case Layout_1.IUnit.preserveHeight: {
            var factor = containersize.height;
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / 100) * factor,
                    y: (p.y / 100) * factor
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / 100) * factor,
                    y: (s.height / 100) * factor
                };
            }
            break;
        }
        case Layout_1.IUnit.unmanaged:
        case Layout_1.IUnit.unmanagedWidth:
        case Layout_1.IUnit.unmanagedHeight: {
            return v.value;
            break;
        }
    }
    return v.value;
}
exports.toPixel = toPixel;
function toPercent(v, containersize) {
    switch (v.unit) {
        case Layout_1.IUnit.pixel: {
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / containersize.width) * 100,
                    y: (p.y / containersize.height) * 100,
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / containersize.width) * 100,
                    y: (s.height / containersize.height) * 100,
                };
            }
            break;
        }
        case Layout_1.IUnit.percent: {
            return v.value;
            break;
        }
        case Layout_1.IUnit.preserve: {
            var factor = (containersize.height < containersize.width) ? containersize.height : containersize.width;
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / factor) * 100,
                    y: (p.y / factor) * 100,
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / factor) * 100,
                    y: (s.height / factor) * 100,
                };
            }
            break;
        }
        case Layout_1.IUnit.preserveWidth: {
            var factor = containersize.width;
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / factor) * 100,
                    y: (p.y / factor) * 100,
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / factor) * 100,
                    y: (s.height / factor) * 100,
                };
            }
            break;
        }
        case Layout_1.IUnit.preserveHeight: {
            var factor = containersize.height;
            if ('x' in v.value) {
                var p = v.value;
                return {
                    x: (p.x / factor) * 100,
                    y: (p.y / factor) * 100,
                };
            }
            else {
                var s = v.value;
                return {
                    x: (s.width / factor) * 100,
                    y: (s.height / factor) * 100,
                };
            }
            break;
        }
        case Layout_1.IUnit.unmanaged:
        case Layout_1.IUnit.unmanagedWidth:
        case Layout_1.IUnit.unmanagedHeight: {
            return v.value;
            break;
        }
    }
    return v.value;
}
exports.toPercent = toPercent;
function add(v1, v2, containersize) {
    var p1 = toPixel(v1, containersize);
    var p2 = toPixel(v2, containersize);
    if ('x' in p1 && 'x' in p2) {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y
        };
    }
    if ('width' in p1 && 'width' in p2) {
        return {
            width: p1.width + p2.width,
            height: p1.height + p2.height
        };
    }
    return {
        x: NaN,
        y: NaN
    };
}
exports.add = add;
//# sourceMappingURL=utils.js.map