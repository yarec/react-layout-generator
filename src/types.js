"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugOptions;
(function (DebugOptions) {
    DebugOptions[DebugOptions["none"] = 0] = "none";
    DebugOptions[DebugOptions["info"] = 1] = "info";
    DebugOptions[DebugOptions["warning"] = 2] = "warning";
    DebugOptions[DebugOptions["warningAll"] = 1] = "warningAll";
    DebugOptions[DebugOptions["error"] = 4] = "error";
    DebugOptions[DebugOptions["errorAll"] = 3] = "errorAll";
    DebugOptions[DebugOptions["trace"] = 8] = "trace";
    DebugOptions[DebugOptions["traceAll"] = 7] = "traceAll";
    DebugOptions[DebugOptions["timing"] = 16] = "timing";
    DebugOptions[DebugOptions["data"] = 32] = "data";
    DebugOptions[DebugOptions["mouseEvents"] = 64] = "mouseEvents";
    DebugOptions[DebugOptions["all"] = 127] = "all";
})(DebugOptions = exports.DebugOptions || (exports.DebugOptions = {}));
function rectSize(rect) {
    return { width: rect.width, height: rect.height };
}
exports.rectSize = rectSize;
function rectPoint(rect) {
    return { x: rect.x, y: rect.y };
}
exports.rectPoint = rectPoint;
var Rect = (function () {
    function Rect(rect) {
        this.y = 0;
        this.x = 0;
        this.width = 0;
        this.height = 0;
        this.update(rect);
    }
    Rect.prototype.update = function (rect) {
        this.setLocation({ x: rect.x, y: rect.y });
        this.setSize({ width: rect.width, height: rect.height });
    };
    Rect.prototype.setLocation = function (p) {
        this.x = p.x;
        this.y = p.y;
    };
    Object.defineProperty(Rect.prototype, "data", {
        get: function () {
            var r = {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "location", {
        get: function () {
            return { x: this.x, y: this.y };
        },
        set: function (p) {
            this.setLocation(p);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "size", {
        get: function () {
            return { width: this.width, height: this.height };
        },
        set: function (s) {
            this.setSize(s);
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.setSize = function (s) {
        this.width = s.width;
        this.height = s.height;
    };
    Object.defineProperty(Rect.prototype, "top", {
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "left", {
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "leftTop", {
        get: function () {
            return { x: this.x, y: this.y };
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.translate = function (point) {
        return {
            y: this.y + point.y,
            x: this.x + point.x,
            height: this.height,
            width: this.width
        };
    };
    Rect.prototype.add = function (rect) {
        return {
            y: this.y + rect.y,
            x: this.x + rect.x,
            height: this.height + rect.height,
            width: this.width + rect.width
        };
    };
    return Rect;
}());
exports.Rect = Rect;
var Point = (function () {
    function Point() {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.isEmpty = function () {
            return _this.x === 0 && _this.y === 0;
        };
    }
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=types.js.map