"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layouts_1 = require("../components/Layouts");
var Generator = (function () {
    function Generator(name, init, params, create, editHelper) {
        var _this = this;
        this.name = function () {
            return _this._name;
        };
        this.editHelper = function () {
            return _this._editHelper;
        };
        this.params = function () {
            return _this._params;
        };
        this.layouts = function () {
            return _this._layouts;
        };
        this.select = function () {
            return _this._select;
        };
        this.lookup = function (name) {
            return _this._layouts.get(name);
        };
        this.containersize = function (name) {
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
        this.reset = function () {
            _this._layouts = _this._init(_this);
            _this.state = _this.start;
            _this._layoutsIterator = _this._layouts.values();
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
        this.setup = function (values) {
            if (_this._params.get('$setup', true) === undefined) {
                _this._params.set('$setup', 1);
                values.forEach(function (value) {
                    _this._params.set(value[0], value[1]);
                });
            }
        };
        this.nextBlock = function () {
            _this.currentLayout = _this._layoutsIterator.next().value;
            if (_this.currentLayout) {
                _this.state = _this.nextTile;
                return _this.nextTile();
            }
            else {
                _this.state = _this.start;
                return undefined;
            }
        };
        this.nextTile = function () {
            var b = _this.currentLayout;
            if (b) {
                _this.state = _this.nextBlock;
            }
            return b;
        };
        this._name = name;
        this._init = init;
        this._editHelper = editHelper;
        this._create = create;
        this._layouts = new Layouts_1.default([]);
        this._layoutsIterator = this._layouts.values();
        this.state = this.start;
        this._params = params;
    }
    return Generator;
}());
exports.default = Generator;
//# sourceMappingURL=Generator.js.map