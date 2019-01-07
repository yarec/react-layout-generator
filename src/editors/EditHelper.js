"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status[Status["disabled"] = 0] = "disabled";
    Status[Status["down"] = 1] = "down";
    Status[Status["up"] = 2] = "up";
})(Status = exports.Status || (exports.Status = {}));
var EditHelper = (function () {
    function EditHelper() {
        var _this = this;
        this.register = function (editTool) {
            _this._updateTool = editTool;
        };
        this.do = function (name) {
            var command = _this._commands.get(name);
            if (command) {
                var v = _this._status.get(name);
                if (v && typeof v === 'function') {
                    command(v());
                }
                else if (v && typeof v === 'number') {
                    var status_1 = command(v);
                    if (status_1) {
                        _this._status.set(name, status_1);
                    }
                }
            }
        };
        this.status = function (name) {
            var r = _this._status.get(name);
            if (r && typeof r === 'function') {
                return r();
            }
            else if (r && typeof r === 'number') {
                return r;
            }
            return Status.disabled;
        };
        this._commands = new Map;
        this._status = new Map;
        this._updateTool = undefined;
    }
    EditHelper.prototype.clear = function () {
        this._commands.clear();
        this._status.clear();
    };
    EditHelper.prototype.load = function (commands) {
        var _this = this;
        this._commands.clear();
        this._status.clear();
        commands.forEach(function (item) {
            _this._commands.set(item.name, item.command);
            _this._status.set(item.name, item.status);
        });
        if (this._updateTool) {
            this._updateTool.updateTool();
        }
    };
    return EditHelper;
}());
exports.default = EditHelper;
//# sourceMappingURL=EditHelper.js.map