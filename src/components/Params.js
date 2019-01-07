"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = require("underscore");
var types_1 = require("../types");
var Params = (function () {
    function Params(props) {
        this._map = new Map([]);
        this._name = props.name;
        this._changeCount = 0;
        this._save = props.save;
        this._load = props.load;
        this._debug = props.debug ? props.debug : types_1.DebugOptions.none;
        if (props.initialValues) {
            this.restore('', props.initialValues);
        }
    }
    Params.prototype.restore = function (name, values, replace) {
        var _this = this;
        if (this._debug & types_1.DebugOptions.data) {
            values.forEach(function (value) {
                console.log("Params restore init values " + value[0], value[1]);
            });
        }
        if (replace) {
            this._map.clear();
        }
        if (this._map.size === 0) {
            if (this._load) {
                values.forEach(function (value) {
                    var v = _this._load(_this._name, value[0]);
                    if (v) {
                        if (_this._debug & types_1.DebugOptions.data) {
                            console.log("Params restore from  localStorage " + value[0], v);
                        }
                        _this.set(value[0], v);
                    }
                    else {
                        _this.set(value[0], value[1]);
                    }
                });
            }
            else {
                values.forEach(function (value) {
                    _this.set(value[0], value[1]);
                });
            }
            return this;
        }
        values.forEach(function (value) {
            var v = _this._map.get(value[0]);
            if (v === undefined) {
                _this.set(value[0], value[1]);
            }
        });
        return this;
    };
    Object.defineProperty(Params.prototype, "map", {
        get: function () {
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "save", {
        get: function () {
            return this._save;
        },
        set: function (fn) {
            this._save = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "load", {
        get: function () {
            return this._load;
        },
        set: function (fn) {
            this._load = fn;
        },
        enumerable: true,
        configurable: true
    });
    Params.prototype.changed = function () {
        var changed = this._changeCount;
        this._changeCount = 0;
        return changed !== 0;
    };
    Params.prototype.touch = function () {
        this._changeCount += 1;
    };
    Params.prototype.get = function (key, load) {
        if (load && this._load) {
            var v = this._load(this._name, key);
            if (v) {
                return v;
            }
        }
        return this._map.get(key);
    };
    Params.prototype.set = function (key, v) {
        var r = this._map.get(key);
        if (r && !underscore_1.isEqual(v, r)) {
            this._changeCount += 1;
            if (this._save) {
                this._save(this._name, key, v);
            }
            ;
            this._map.set(key, v);
            return true;
        }
        if (!r) {
            this._changeCount += 1;
            if (this._save) {
                this._save(this._name, key, v);
            }
            ;
            this._map.set(key, v);
            return true;
        }
        return false;
    };
    return Params;
}());
exports.default = Params;
//# sourceMappingURL=Params.js.map