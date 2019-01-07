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
var utils_1 = require("../generators/utils");
var types_1 = require("../types");
var utils_2 = require("../utils");
var IUnit;
(function (IUnit) {
    IUnit[IUnit["pixel"] = 1] = "pixel";
    IUnit[IUnit["percent"] = 2] = "percent";
    IUnit[IUnit["preserve"] = 3] = "preserve";
    IUnit[IUnit["preserveWidth"] = 4] = "preserveWidth";
    IUnit[IUnit["preserveHeight"] = 5] = "preserveHeight";
    IUnit[IUnit["unmanaged"] = 6] = "unmanaged";
    IUnit[IUnit["unmanagedWidth"] = 7] = "unmanagedWidth";
    IUnit[IUnit["unmanagedHeight"] = 8] = "unmanagedHeight";
})(IUnit = exports.IUnit || (exports.IUnit = {}));
function symbolToIUnit(data) {
    switch (data.charAt(data.length - 1)) {
        case 'x': {
            return IUnit.pixel;
        }
        case '%': {
            return IUnit.percent;
        }
        case 'a': {
            break;
        }
        case 'h': {
            switch (data.charAt(data.length - 2)) {
                case '%': {
                    return IUnit.preserveHeight;
                }
                case 'a': {
                    return IUnit.unmanagedWidth;
                }
            }
            break;
        }
        case 'w': {
            switch (data.charAt(data.length - 2)) {
                case '%': {
                    return IUnit.preserveWidth;
                }
                case 'a': {
                    return IUnit.unmanagedWidth;
                }
            }
            break;
        }
    }
    return IUnit.pixel;
}
exports.symbolToIUnit = symbolToIUnit;
function namedUnit(u) {
    var name = 'unknown';
    switch (u) {
        case IUnit.pixel: {
            name = 'pixel';
            break;
        }
        case IUnit.percent: {
            name = 'percent';
            break;
        }
        case IUnit.preserve: {
            name = 'preserve';
            break;
        }
        case IUnit.preserveWidth: {
            name = 'preserveWidth';
            break;
        }
        case IUnit.preserveHeight: {
            name = 'preserveHeight';
            break;
        }
        case IUnit.unmanaged: {
            name = 'unmanaged';
            break;
        }
        case IUnit.unmanagedWidth: {
            name = 'unmanagedWidth';
            break;
        }
        case IUnit.unmanagedHeight: {
            name = 'unmanagedHeight';
            break;
        }
    }
    return name;
}
exports.namedUnit = namedUnit;
var PositionRef;
(function (PositionRef) {
    PositionRef[PositionRef["none"] = 0] = "none";
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
function namedPositionRef(pos) {
    var name = 'unknown';
    switch (pos) {
        case PositionRef.position: {
            name = 'position';
            break;
        }
        case PositionRef.top: {
            name = 'top';
            break;
        }
        case PositionRef.bottom: {
            name = 'bottom';
            break;
        }
        case PositionRef.left: {
            name = 'left';
            break;
        }
        case PositionRef.right: {
            name = 'right';
            break;
        }
        case PositionRef.leftTop: {
            name = 'leftTop';
            break;
        }
        case PositionRef.rightTop: {
            name = 'rightTop';
            break;
        }
        case PositionRef.leftBottom: {
            name = 'leftBottom';
            break;
        }
        case PositionRef.rightBottom: {
            name = 'rightBottom';
            break;
        }
    }
    return name;
}
exports.namedPositionRef = namedPositionRef;
var LayerOption;
(function (LayerOption) {
    LayerOption[LayerOption["normal"] = 0] = "normal";
    LayerOption[LayerOption["moveToBack"] = 1] = "moveToBack";
    LayerOption[LayerOption["moveToFront"] = 2] = "moveToFront";
    LayerOption[LayerOption["moveUp"] = 3] = "moveUp";
    LayerOption[LayerOption["moveDown"] = 4] = "moveDown";
})(LayerOption = exports.LayerOption || (exports.LayerOption = {}));
var Layout = (function () {
    function Layout(name, p, g) {
        var _this = this;
        this._siblings = new Map();
        this._layer = utils_1.flowLayoutLayer;
        this.connectionHandles = function () {
            var align = _this._position.align;
            if (align) {
                var ref = _this.getRef();
                if (ref) {
                    var p1 = ref.fromLocation();
                    var s1 = ref.fromSize();
                    var r1 = _this.getConnectPoint(p1, s1, align.source);
                    var p2 = _this.fromLocation();
                    var s2 = _this.fromSize();
                    var r2 = _this.getConnectPoint(p2, s2, align.self);
                    return [r1, r2];
                }
            }
            return [];
        };
        this.fromLocation = function () {
            if (_this._position.align) {
                var ref = _this.getRef();
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
            return _this.fromOrigin(point, _this.position.units.origin, _this.fromSize());
        };
        this.fromSize = function () {
            return _this.scale(_this._position.size, _this._position.units.size);
        };
        this.rect = function (force) {
            if (_this._changed || force) {
                _this._changed = false;
                _this._cached.update(__assign({}, _this.fromLocation(), _this.fromSize()));
            }
            return _this._cached.data;
        };
        this.touch = function () {
            _this.changed();
        };
        this.update = function (location, size) {
            var itemSize = size ? size : _this.fromSize();
            if (_this._position.align && _this.getRef()) {
                var align = _this._position.align;
                var ref = _this.getRef();
                var p1 = ref.fromLocation();
                var s1 = ref.fromSize();
                var r1 = _this.getConnectPoint(p1, s1, align.source);
                var p = _this.toOrigin(location, _this._position.units.origin, itemSize);
                var s2 = _this.inverseScale(itemSize, _this._position.units.size);
                var r2 = _this.getConnectPoint(p, s2, align.self);
                var offset = {
                    x: r2.x - r1.x,
                    y: r2.y - r1.y
                };
                align.offset = offset;
            }
            else {
                var p = _this.toOrigin(location, _this._position.units.origin, itemSize);
                _this._position.location = _this.inverseScale(p, _this._position.units.location);
                _this._position.size = _this.inverseScale(itemSize, _this._position.units.size);
            }
            _this.changed();
        };
        this.updateSize = function (size) {
            _this._position.size = _this.inverseScale(size, _this._position.units.size);
            _this.changed();
        };
        this.scale = function (input, unit) {
            switch (unit) {
                case IUnit.percent: {
                    var size = _this._g.params().get('containersize');
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
                    var size = _this._g.params().get('containersize');
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
                    var size = _this._g.params().get('containersize');
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
                    var size = _this._g.params().get('containersize');
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
            return input;
        };
        this.onResize = function (width, height) {
            if (_this._position.size.width !== width ||
                _this._position.size.height !== height) {
                _this._position.size.width = width;
                _this._position.size.height = height;
                _this.changed();
            }
        };
        this.getRef = function () {
            var ref;
            if (_this._position.align) {
                if (typeof _this._position.align.key === 'string') {
                    ref = _this._g.lookup(_this._position.align.key);
                }
                else {
                    var l = _this._g.layouts();
                    if (l) {
                        ref = l.find(_this._position.align.key);
                    }
                }
            }
            if (ref) {
                ref.sibling = _this.name;
            }
            return ref;
        };
        this.inverseScale = function (input, unit) {
            switch (unit) {
                case IUnit.percent: {
                    var size = _this._g.params().get('containersize');
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
                    var size = _this._g.params().get('containersize');
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
                    var size = _this._g.params().get('containersize');
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
                    var size = _this._g.params().get('containersize');
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
            return input;
        };
        this.fromOrigin = function (p, origin, s) {
            return {
                x: p.x - origin.x * s.width,
                y: p.y - origin.y * s.height
            };
        };
        this.toOrigin = function (p, origin, s) {
            return {
                x: p.x + origin.x * s.width,
                y: p.y + origin.y * s.height
            };
        };
        this.fromAlign = function (p, s, align) {
            return {
                x: p.x - align.x * s.width,
                y: p.y - align.y * s.height
            };
        };
        this.toAlign = function (p, s, align) {
            return {
                x: p.x + align.x * s.width,
                y: p.y + align.y * s.height
            };
        };
        this._name = name;
        this.updatePosition(p);
        this.updateLayer(this._position.layer);
        this._cached = new types_1.Rect({ x: 0, y: 0, width: 0, height: 0 });
        this._changed = true;
        this._g = g;
        this._positionChildren = this._position.positionChildren;
    }
    Object.defineProperty(Layout.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "editor", {
        get: function () {
            return this._position.editor;
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
        set: function (p) {
            this._position = p;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "sibling", {
        set: function (key) {
            this._siblings.set(key, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "onMouseDown", {
        get: function () {
            return this._onMouseDown;
        },
        set: function (fn) {
            this._onMouseDown = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "onClick", {
        get: function () {
            return this._onClick;
        },
        set: function (fn) {
            this._onClick = fn;
        },
        enumerable: true,
        configurable: true
    });
    Layout.prototype.layer = function (zIndex) {
        return this._layer(zIndex);
    };
    Layout.prototype.updateLayer = function (layer) {
        if (layer === undefined) {
            return;
        }
        switch (layer) {
        }
    };
    Layout.prototype.updatePosition = function (p) {
        var _this = this;
        this._position = utils_2.clone(p);
        this._position.units.origin.x = this._position.units.origin.x * .01;
        this._position.units.origin.y = this._position.units.origin.y * .01;
        if (this._position.units.location === IUnit.percent ||
            this._position.units.location === IUnit.preserve ||
            this._position.units.location === IUnit.preserveWidth ||
            this._position.units.location === IUnit.preserveHeight) {
            this._position.location.x = this._position.location.x * .01;
            this._position.location.y *= .01;
        }
        if (this._position.units.size === IUnit.percent ||
            this._position.units.size === IUnit.preserve ||
            this._position.units.size === IUnit.preserveWidth ||
            this._position.units.size === IUnit.preserveHeight) {
            this._position.size.width *= .01;
            this._position.size.height *= .01;
        }
        if (this._position.align) {
            this._position.align.source.x *= .01;
            this._position.align.source.y *= .01;
            this._position.align.self.x *= .01;
            this._position.align.self.y *= .01;
        }
        if (this._position.editor) {
            if (this._position.editor.edits) {
                this._position.editor.edits.forEach(function (edit, i) {
                    _this.setEditDefaults(edit);
                });
            }
        }
        this.changed();
    };
    Layout.prototype.setEditDefaults = function (edit) {
        if (!edit.cursor) {
            edit.cursor = cursor_1.cursor(edit);
        }
        if (!edit.updateHandle) {
            edit.updateHandle = updateHandle_1.default(edit);
        }
        if (!edit.extendElement) {
            edit.extendElement = extendElement_1.default(edit);
        }
    };
    Layout.prototype.changed = function () {
        var _this = this;
        this._changed = true;
        this._siblings.forEach(function (value, key) {
            var l = _this._g.lookup(key);
            if (l) {
                l.touch();
            }
        });
    };
    Layout.prototype.getConnectPoint = function (l, s, a) {
        return { x: l.x + s.width * a.x, y: l.y + s.height * a.y };
    };
    return Layout;
}());
exports.default = Layout;
//# sourceMappingURL=Layout.js.map