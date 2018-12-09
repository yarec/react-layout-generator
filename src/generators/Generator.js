"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layouts_1 = require("../components/Layouts");
var Generator = /** @class */ (function () {
    function Generator(name, init, params, create, parent) {
        var _this = this;
        this.name = function () {
            return _this._name;
        };
        this.params = function () {
            return _this._params;
        };
        this.layouts = function () {
            return _this._layouts;
        };
        this.lookup = function (name) {
            return _this._layouts.get(name);
        };
        this.viewport = function (name) {
            var l = _this._layouts.get(name);
            if (l) {
                var r = l.rect();
                return { width: r.width, height: r.height };
            }
            return { width: 0, height: 0 };
        };
        this.create = function (args) {
            if (_this._create) {
                return _this._create(args);
            }
            return undefined;
        };
        this.parent = function () {
            return _this._parent;
        };
        this.reset = function () {
            // console.log('reset update layouts')
            _this._layouts = _this._init(_this);
            _this.state = _this.start;
            _this._layoutsIterator = _this._layouts.values();
            // this._layouts.layouts.forEach((item: Layout) => {
            //   if (item.g) {
            //     item.g.reset();
            //   }
            // })
        };
        this.clear = function () {
            _this._layouts = new Layouts_1.default([]);
            _this.state = _this.start;
            _this._layoutsIterator = _this._layouts.values();
        };
        this.start = function () {
            return _this.nextBlock();
        };
        this.next = function () {
            return _this.state();
        };
        this.nextBlock = function () {
            _this.currentLayout = _this._layoutsIterator.next().value;
            if (_this.currentLayout) {
                // if (this.currentLayout.g) {
                //   this.state = this.nestedBlock;
                //   return this.nestedBlock();
                // } else {
                _this.state = _this.nextTile;
                return _this.nextTile();
                // }
            }
            else {
                _this.state = _this.start;
                return undefined;
            }
        };
        // private nestedBlock = (): Layout | undefined => {
        //   let b: Layout | undefined = undefined;
        //   if (this.currentLayout && this.currentLayout.g) {
        //     b = this.currentLayout.g.next();
        //   }
        //   if (b === undefined) {
        //     this.state = this.nextBlock;
        //     return this.nextBlock();
        //   }
        //   return b;
        // }
        this.nextTile = function () {
            var b = _this.currentLayout;
            if (b) {
                _this.state = _this.nextBlock;
            }
            return b;
        };
        this._name = name;
        this._init = init;
        this._create = create;
        this._layouts = new Layouts_1.default([]);
        this._layoutsIterator = this._layouts.values();
        this.state = this.start;
        this._params = params;
        this._parent = parent;
    }
    return Generator;
}());
exports.default = Generator;
//# sourceMappingURL=Generator.js.map