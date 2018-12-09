"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var cursor_1 = require("../editors/cursor");
var extendElement_1 = require("../editors/extendElement");
var updateHandle_1 = require("../editors/updateHandle");
var types_1 = require("../types");
var utils_1 = require("../utils");
/**
 * Defines the units of location and size
 */
var IUnit;
(function (IUnit) {
    IUnit[IUnit["unmanaged"] = 0] = "unmanaged";
    IUnit[IUnit["pixel"] = 1] = "pixel";
    IUnit[IUnit["percent"] = 2] = "percent";
    IUnit[IUnit["preserve"] = 3] = "preserve";
    IUnit[IUnit["preserveWidth"] = 4] = "preserveWidth";
    IUnit[IUnit["preserveHeight"] = 5] = "preserveHeight";
})(IUnit = exports.IUnit || (exports.IUnit = {}));
var PositionRef;
(function (PositionRef) {
    PositionRef[PositionRef["position"] = 1] = "position";
    PositionRef[PositionRef["top"] = 2] = "top";
    PositionRef[PositionRef["bottom"] = 3] = "bottom";
    PositionRef[PositionRef["left"] = 4] = "left";
    PositionRef[PositionRef["right"] = 5] = "right";
    PositionRef[PositionRef["leftTop"] = 6] = "leftTop";
    PositionRef[PositionRef["rightTop"] = 7] = "rightTop";
    PositionRef[PositionRef["leftBottom"] = 8] = "leftBottom";
    PositionRef[PositionRef["rightBottom"] = 9] = "rightBottom";
})(PositionRef = exports.PositionRef || (exports.PositionRef = {}));
;
function move(rect) {
    /**
     * returns the edit handle the user is interacting with
     */
    return rect;
}
exports.move = move;
function update(rect) {
    /**
     * updates the Position and/or dependent params
     *
     * Editor gets the updated values from Layout
     */
}
exports.update = update;
/**
 * Defines the location and size using
 * specified origin and units. Supports edit handles
 * defined by IAlign (.eg left center, right bottom)
 */
var Layout = /** @class */ (function () {
    function Layout(name, p, g) {
        var _this = this;
        this.clone = function () {
            var p = utils_1.clone(_this._position);
            return new Layout(_this._name, p, _this._g);
        };
        /**
         * Converts location to pixels
         */
        this.fromLocation = function () {
            // Handle align - ignore actual value of location
            if (_this._position.align) {
                var ref = void 0;
                if (typeof _this._position.align.key === 'string') {
                    ref = _this._g.lookup(_this._position.align.key);
                }
                else {
                    var l = _this._g.layouts();
                    if (l) {
                        ref = l.find(_this._position.align.key);
                    }
                }
                if (ref) {
                    var p = ref.fromLocation();
                    var s = ref.fromSize();
                    var source = _this.toAlign(p, s, _this._position.align.source);
                    var offset = {
                        x: source.x + _this._position.align.offset.x,
                        y: source.y + _this._position.align.offset.y
                    };
                    return _this.fromAlign(offset, _this.fromSize(), _this._position.align.self);
                }
            }
            var point = _this.scale(_this._position.location, _this._position.units.location);
            if (point.x === undefined) {
                console.log('fromLocation ', point.x);
            }
            return _this.fromOrigin(point, _this.fromSize());
        };
        /**
         * Converts size to pixels
         */
        this.fromSize = function () {
            // console.log('size ' + this._position.size.width)
            return _this.scale(_this._position.size, _this._position.units.size);
        };
        this.rect = function (force) {
            if (_this._changed || force) {
                _this._changed = false;
                _this._cached.update(__assign({}, _this.fromLocation(), _this.fromSize()));
            }
            return __assign({}, _this._cached);
        };
        this.touch = function () {
            _this._changed = true;
        };
        /**
         * Change the layout state
         */
        this.update = function (location, size) {
            // Takes in world coordinates 
            // console.log(`Position update x: ${location.x} y: ${location.y}`)
            var p = _this.toOrigin(location, size);
            _this._position.location = _this.inverseScale(p, _this._position.units.location);
            _this._position.size = _this.inverseScale(size, _this._position.units.size);
            _this._changed = true;
        };
        this.updateSize = function (size) {
            // Takes in world coordinates 
            _this._position.size = _this.inverseScale(size, _this._position.units.size);
            _this._changed = true;
        };
        /**
         * Take percent and convert to real world
         */
        this.scale = function (input, unit) {
            switch (unit) {
                case IUnit.percent: {
                    var size = _this._g.params().get('viewport');
                    if ('x' in input) {
                        var p = input;
                        return {
                            x: p.x * size.width,
                            y: p.y * size.height
                        };
                    }
                    else {
                        var s = input;
                        return {
                            width: s.width * size.width,
                            height: s.height * size.height
                        };
                    }
                    break;
                }
                case IUnit.preserve: {
                    var size = _this._g.params().get('viewport');
                    var minWidth = (size.width < size.height) ? size.width : size.height;
                    if ('x' in input) {
                        var p = input;
                        return {
                            x: p.x * minWidth,
                            y: p.y * minWidth
                        };
                    }
                    else {
                        var s = input;
                        return {
                            width: s.width * minWidth,
                            height: s.height * minWidth
                        };
                    }
                    break;
                }
                case IUnit.preserveWidth: {
                    var size = _this._g.params().get('viewport');
                    var factor = size.width;
                    if ('x' in input) {
                        var p = input;
                        return {
                            x: p.x * factor,
                            y: p.y * factor
                        };
                    }
                    else {
                        var s = input;
                        return {
                            width: s.width * factor,
                            height: s.height * factor
                        };
                    }
                    break;
                }
                case IUnit.preserveHeight: {
                    var size = _this._g.params().get('viewport');
                    var factor = size.height;
                    if ('x' in input) {
                        var p = input;
                        return {
                            x: p.x * factor,
                            y: p.y * factor
                        };
                    }
                    else {
                        var s = input;
                        return {
                            width: s.width * factor,
                            height: s.height * factor
                        };
                    }
                    break;
                }
            }
            // default no translation needed
            return input;
        };
        this.onResize = function (width, height) {
            if (_this._position.size.width !== width ||
                _this._position.size.height !== height) {
                _this._position.size.width = width;
                _this._position.size.height = height;
                _this._changed = true;
            }
        };
        /**
         * Take pixels and convert to percent
         */
        this.inverseScale = function (input, unit) {
            switch (unit) {
                case IUnit.percent: {
                    var size = _this._g.params().get('viewport');
                    if (size.width && size.height) {
                        if ('x' in input) {
                            var p = input;
                            return {
                                x: p.x / size.width,
                                y: p.y / size.height
                            };
                        }
                        else {
                            var s = input;
                            return {
                                width: s.width / size.width,
                                height: s.height / size.height
                            };
                        }
                    }
                    break;
                }
                case IUnit.preserve: {
                    var size = _this._g.params().get('viewport');
                    var minWidth = (size.width < size.height) ? size.width : size.height;
                    if (minWidth) {
                        if ('x' in input) {
                            var p = input;
                            return {
                                x: p.x / minWidth,
                                y: p.y / minWidth
                            };
                        }
                        else {
                            var s = input;
                            return {
                                width: s.width / minWidth,
                                height: s.height / minWidth
                            };
                        }
                    }
                    break;
                }
                case IUnit.preserveWidth: {
                    var size = _this._g.params().get('viewport');
                    var factor = size.width;
                    if (factor) {
                        if ('x' in input) {
                            var p = input;
                            return {
                                x: p.x / factor,
                                y: p.y / factor
                            };
                        }
                        else {
                            var s = input;
                            return {
                                width: s.width / factor,
                                height: s.height / factor
                            };
                        }
                    }
                    break;
                }
                case IUnit.preserveHeight: {
                    var size = _this._g.params().get('viewport');
                    var factor = size.height;
                    if (factor) {
                        if ('x' in input) {
                            var p = input;
                            return {
                                x: p.x / factor,
                                y: p.y / factor
                            };
                        }
                        else {
                            var s = input;
                            return {
                                width: s.width / factor,
                                height: s.height / factor
                            };
                        }
                    }
                    break;
                }
            }
            // default
            return input;
        };
        //   private scalePreserve = (width: number, height: number) => {
        //     const size = this._g.params().get('viewport') as ISize;
        //     const ratio = Math.min(size.width / width, size.height / height);
        //     return { width: width*ratio, height: height*ratio };
        //  }
        /**
         * Defines the origin of location in percent
         * If the origin is (50,50) then the top left is
         * (p.x - .50 * s.x, p.y - .50 * s.y)
         *
         *  x----------------
         *  |               |
         *  |       o       |
         *  |               |
         *  ----------------
         *  o: origin
         *  x: left top
         */
        this.fromOrigin = function (p, s) {
            return {
                x: p.x - _this._position.units.origin.x * s.width,
                y: p.y - _this._position.units.origin.y * s.height
            };
        };
        /**
         * reverses fromOrigin
         */
        this.toOrigin = function (p, s) {
            return {
                x: p.x + _this._position.units.origin.x * s.width,
                y: p.y + _this._position.units.origin.y * s.height
            };
        };
        /**
         * Compute left top point of rectangle based on align value
         * If p represents the bottom center point then the top left
         * position is (p.x - s.x / 2, p.y - s.y;)
         * Inverse of toAlign.
         */
        this.fromAlign = function (p, s, align) {
            return {
                x: p.x - align.x * s.width,
                y: p.y - align.y * s.height
            };
        };
        /**
         * Gets the point of an handle given an origin and size
         * if align is left top then return (rect.left, rect.top)
         * if align if bottom center then return
         * (r.left + r.halfWidth, r.bottom;)
         *  Inverse of fromAlign.
         */
        this.toAlign = function (p, s, align) {
            return {
                x: p.x + align.x * s.width,
                y: p.y + align.y * s.height
            };
        };
        // console.log(`initialize Layout ${name}`)
        this._name = name;
        this._position = utils_1.clone(p);
        this._cached = new types_1.Rect({ x: 0, y: 0, width: 0, height: 0 });
        this._changed = true;
        this._g = g;
        this._positionChildren = this._position.positionChildren;
        // Convert percents to decimal
        this._position.units.origin.x *= .01;
        this._position.units.origin.y *= .01;
        // Convert percents to decimal
        if (this._position.units.location === IUnit.percent ||
            this._position.units.location === IUnit.preserve ||
            this._position.units.location === IUnit.preserveWidth ||
            this._position.units.location === IUnit.preserveHeight) {
            this._position.location.x *= .01;
            this._position.location.y *= .01;
        }
        // Convert percents to decimal
        if (this._position.units.size === IUnit.percent ||
            this._position.units.size === IUnit.preserve ||
            this._position.units.size === IUnit.preserveWidth ||
            this._position.units.size === IUnit.preserveHeight) {
            this._position.size.width *= .01;
            this._position.size.height *= .01;
        }
        // Convert percents to decimal
        if (this._position.align) {
            this._position.align.source.x *= .01;
            this._position.align.source.y *= .01;
            this._position.align.self.x *= .01;
            this._position.align.self.y *= .01;
        }
        if (this._position.edit) {
            this._position.edit.forEach(function (edit) {
                if (!edit.cursor) {
                    edit.cursor = cursor_1.cursor(edit);
                }
                if (!edit.updateHandle) {
                    edit.updateHandle = updateHandle_1.default(edit);
                }
                if (!edit.extendElement) {
                    edit.extendElement = extendElement_1.default(edit);
                }
            });
        }
    }
    Object.defineProperty(Layout.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "edit", {
        get: function () {
            return this._position.edit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "units", {
        get: function () {
            return this._position.units;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "location", {
        get: function () {
            return this._position.location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "size", {
        get: function () {
            return this._position.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "resize", {
        get: function () {
            return this.onResize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "generator", {
        get: function () {
            return this._g;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "positionChildren", {
        get: function () {
            return this._positionChildren;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    return Layout;
}());
exports.default = Layout;
//# sourceMappingURL=Layout.js.map