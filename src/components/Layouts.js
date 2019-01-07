"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("./Layout");
var Layouts = (function () {
    function Layouts(layouts) {
        var _this = this;
        this._byIndex = new Array();
        this._layouts = new Map(layouts);
        this._layouts.forEach(function (value) {
            _this._byIndex.push(value);
        });
    }
    Layouts.prototype.values = function () {
        return this._layouts.values();
    };
    Object.defineProperty(Layouts.prototype, "map", {
        get: function () {
            return this._layouts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layouts.prototype, "size", {
        get: function () {
            return this._layouts.size;
        },
        enumerable: true,
        configurable: true
    });
    Layouts.prototype.find = function (i) {
        return this._byIndex[i];
    };
    Layouts.prototype.get = function (key) {
        return this._layouts.get(key);
    };
    Layouts.prototype.set = function (key, p, g) {
        var layout = this._layouts.get(key);
        if (layout) {
            layout.updatePosition(p);
        }
        else {
            layout = new Layout_1.default(key, p, g);
            this._layouts.set(key, layout);
            if (this._layouts.size > this._byIndex.length) {
                this._byIndex.push(layout);
            }
        }
        return layout;
    };
    return Layouts;
}());
exports.default = Layouts;
//# sourceMappingURL=Layouts.js.map