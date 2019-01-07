"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var utils_1 = require("../utils");
var EditHelper_1 = require("./EditHelper");
var Command = (function () {
    function Command(menuItem) {
        var _this = this;
        this.wrappedStatus = function () {
            if (!_this._menuItem.disabled) {
                return EditHelper_1.Status.down;
            }
            if (_this._menuItem.checked) {
                return EditHelper_1.Status.up;
            }
            return EditHelper_1.Status.disabled;
        };
        this.wrappedCommand = function (status) {
            if (_this._menuItem.command) {
                _this._menuItem.command();
            }
            return _this.wrappedStatus();
        };
        this._menuItem = menuItem;
        this.name = menuItem.name;
        this.command = this.wrappedCommand;
        this.status = this.wrappedStatus;
    }
    return Command;
}());
var RLGSelect = (function (_super) {
    __extends(RLGSelect, _super);
    function RLGSelect(props) {
        var _this = _super.call(this, props) || this;
        _this._selected = new Map([]);
        _this._undo = [];
        _this._redo = [];
        _this.selected = function (name) {
            return _this._selected.get(name) !== undefined;
        };
        _this.undo = function () {
            if (_this._undo.length) {
                var data = _this._undo.pop();
                if (data) {
                    var oldData = _this.restore(data);
                    _this._redo.push(oldData);
                }
            }
        };
        _this.redo = function () {
            if (_this._redo.length) {
                var data = _this._redo.pop();
                if (data) {
                    var oldData = _this.restore(data);
                    _this._undo.push(oldData);
                }
            }
        };
        _this.restore = function (data) {
            _this._selected.clear();
            var layouts = _this.props.g.layouts();
            var oldData = [];
            data.forEach(function (saved) {
                var layout = layouts.get(saved.name);
                if (layout) {
                    oldData.push({ name: saved.name, value: utils_1.clone(layout.rect()) });
                    var r = saved.value;
                    console.log("Select restore " + saved.name + " " + saved.value.x + " " + saved.value.y);
                    layout.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
                    _this._selected.set(layout.name, layout);
                }
            });
            _this.props.onUpdate();
            return oldData;
        };
        _this.pushState = function () {
            var data = [];
            _this._selected.forEach(function (layout) {
                data.push({ name: layout.name, value: utils_1.clone(layout.rect()) });
            });
            _this._undo.push(data);
        };
        _this.alignCenter = function () {
            var center;
            _this.pushState();
            _this._selected.forEach(function (layout) {
                var r = layout.rect();
                if (center === undefined) {
                    center = r.x + .5 * r.width;
                }
                else {
                    layout.update({ x: center - r.width / 2, y: r.y }, { width: r.width, height: r.height });
                }
            });
            if (_this._selected.size) {
                _this.props.onUpdate();
            }
        };
        _this.alignMiddle = function () {
            var middle;
            _this.pushState();
            _this._selected.forEach(function (layout) {
                var r = layout.rect();
                if (middle === undefined) {
                    middle = r.y + .5 * r.height;
                }
                else {
                    layout.update({ x: r.x, y: middle - r.height / 2 }, { width: r.width, height: r.height });
                }
            });
            if (_this._selected.size) {
                _this.props.onUpdate();
            }
        };
        _this.alignTop = function () {
            var top;
            _this.pushState();
            _this._selected.forEach(function (layout) {
                var r = layout.rect();
                if (top === undefined) {
                    top = r.y;
                }
                layout.update({ x: r.x, y: top }, { width: r.width, height: r.height });
            });
            if (_this._selected.size) {
                _this.props.onUpdate();
            }
        };
        _this.alignLeft = function () {
            var left;
            _this.pushState();
            _this._selected.forEach(function (layout) {
                var r = layout.rect();
                if (left === undefined) {
                    left = r.x;
                }
                layout.update({ x: left, y: r.y }, { width: r.width, height: r.height });
            });
            if (_this._selected.size) {
                _this.props.onUpdate();
            }
        };
        _this.alignBottom = function () {
            var bottom;
            _this.pushState();
            _this._selected.forEach(function (layout) {
                var r = layout.rect();
                if (bottom === undefined) {
                    bottom = r.y + r.height;
                }
                layout.update({ x: r.x, y: bottom - r.height }, { width: r.width, height: r.height });
            });
            if (_this._selected.size) {
                _this.props.onUpdate();
            }
        };
        _this.alignRight = function () {
            var right;
            _this.pushState();
            _this._selected.forEach(function (layout) {
                var r = layout.rect();
                if (right === undefined) {
                    right = r.x + r.width;
                }
                layout.update({ x: right - r.width, y: r.y }, { width: r.width, height: r.height });
            });
            if (_this._selected.size) {
                _this.props.onUpdate();
            }
        };
        _this.props.select(_this);
        _this._editHelper = _this.props.g.editor && _this.props.g.editor();
        _this.state = { contextMenu: false };
        return _this;
    }
    RLGSelect.prototype.componentDidMount = function () {
        if (this._editHelper) {
            var commands_1 = [];
            var menus = this.commands;
            menus.forEach(function (item) {
                var cmd = new Command(item);
                commands_1.push(cmd);
            });
            this._editHelper.load(commands_1);
        }
    };
    Object.defineProperty(RLGSelect.prototype, "commands", {
        get: function () {
            var disabled = this._selected.size > 1 ? false : true;
            var menuCommands = [
                { name: 'undo', disabled: this._undo.length ? false : true, command: this.undo },
                { name: 'redo', disabled: this._redo.length ? false : true, command: this.redo },
                { name: '' },
                { name: 'alignLeft', disabled: disabled, command: this.alignLeft },
                { name: 'alignCenter', disabled: disabled, command: this.alignCenter },
                { name: 'alignRight', disabled: disabled, command: this.alignRight },
                { name: '' },
                { name: 'alignTop', disabled: disabled, command: this.alignTop },
                { name: 'alignMiddle', disabled: disabled, command: this.alignMiddle },
                { name: 'alignBottom', disabled: disabled, command: this.alignBottom },
            ];
            return menuCommands;
        },
        enumerable: true,
        configurable: true
    });
    RLGSelect.prototype.add = function (layout) {
        this._selected.set(layout.name, layout);
    };
    RLGSelect.prototype.remove = function (layout) {
        this._selected.delete(layout.name);
    };
    RLGSelect.prototype.clear = function () {
        this._selected.clear();
        if (this._editHelper) {
            this._editHelper.clear();
        }
        this.props.onUpdate();
    };
    RLGSelect.prototype.render = function () {
        return (React.createElement("div", { key: 'select', style: {
                background: 'transparent',
                position: 'absolute',
                width: this.props.boundary.width,
                height: this.props.boundary.height
            } }));
    };
    return RLGSelect;
}(React.Component));
exports.default = RLGSelect;
//# sourceMappingURL=RLGSelect.js.map