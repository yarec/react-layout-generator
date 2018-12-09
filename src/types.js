"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export function translate(r: IRect, p: IPoint): IRect {
//   return {
//     y: r.y + p.y,
//     x: r.x + p.x,
//     width: r.width,
//     height: r.height
//   };
// }
// export function scale(r: IRect, p: IPoint): IRect {
//   return {
//     y: r.y * p.y,
//     x: r.x * p.x,
//     height: r.height * p.y,
//     width: r.width * p.x
//   };
// }
// export function width(r: IRect) {
//   return r.width;
// }
// export function height(r: IRect) {
//   return r.height;
// }
var Rect = /** @class */ (function () {
    // private _halfWidth: number = 0;
    // private _halfHeight: number = 0;
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
        // this._halfWidth = s.width / 2;
        // this._halfHeight = s.height / 2;
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
        // get halfWidth() {
        //   return this._halfWidth;
        // }
        // get halfHeight() {
        //   return this._halfHeight;
        // }
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
// tslint:disable-next-line:max-classes-per-file
var Point = /** @class */ (function () {
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