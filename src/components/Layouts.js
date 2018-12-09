"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layouts = /** @class */ (function () {
    // width: number;
    // height: number;
    function Layouts(layouts) {
        var _this = this;
        this._byIndex = new Array();
        this._layouts = new Map(layouts);
        this._layouts.forEach(function (value) {
            _this._byIndex.push(value);
        });
    }
    // update() {
    //   this.width = 0;
    //   this.height = 0;
    //   Get actual width and height
    //   this._layouts.forEach((layout) => {
    //     if (this.width < layout.location.right) {
    //       this.width = layout.location.right
    //     }
    //     if (this.height < layout.location.bottom) {
    //       this.height = layout.location.bottom
    //     }
    //   });
    // }
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
        // console.log(Object.keys(this._layouts))
        // const key = Object.keys(this._layouts)[i];
        return this._byIndex[i];
    };
    Layouts.prototype.get = function (key) {
        return this._layouts.get(key);
    };
    Layouts.prototype.set = function (key, v) {
        // const s = this._layouts.size;
        this._layouts.set(key, v);
        if (this._layouts.size > this._byIndex.length) {
            // Add to byIndex array
            this._byIndex.push(v);
        }
    };
    return Layouts;
}());
exports.default = Layouts;
//# sourceMappingURL=Layouts.js.map