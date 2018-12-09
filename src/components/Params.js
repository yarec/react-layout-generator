"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = require("underscore");
var Params = /** @class */ (function () {
    function Params(values) {
        this.map = new Map(values);
        this.changeCount = 0;
    }
    Params.prototype.restore = function (name, values) {
        // 1) if params are empty then just insert the params
        var _this = this;
        if (this.map.size === 0) {
            values.forEach(function (value) {
                _this.map.set(value[0], value[1]);
            });
            return this;
        }
        // 2) verify that params has all the keys
        var count = 0;
        values.forEach(function (value) {
            count += _this.map.get(value[0]) ? 0 : 1;
        });
        if (count) {
            throw (new Error("Params mismatch count: " + count + ". Did you pass the wrong Params to generator " + name + "?"));
        }
        return this;
    };
    Params.prototype.changed = function () {
        var changed = this.changeCount;
        this.changeCount = 0;
        return changed !== 0;
    };
    Params.prototype.touch = function () {
        this.changeCount += 1;
    };
    Params.prototype.get = function (key) {
        return this.map.get(key);
    };
    Params.prototype.set = function (key, v) {
        var r = this.map.get(key);
        // Only set if changed
        if (r && !underscore_1.isEqual(v, r)) {
            // console.log('Param.set ', key, v);
            this.changeCount += 1;
            this.map.set(key, v);
            return true;
        }
        if (!r) {
            // console.log('Param.set ', key);
            this.changeCount += 1;
            this.map.set(key, v);
            return true;
        }
        return false;
    };
    return Params;
}());
exports.default = Params;
//# sourceMappingURL=Params.js.map