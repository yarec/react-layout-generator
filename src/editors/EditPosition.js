"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function editStyle(props) {
    return {
        boxSizing: 'border-box',
        transformOrigin: 0,
        transform: "translate(" + props.handle.x + "px, " + props.handle.y + "px)",
        width: props.handle.width + "px",
        height: props.handle.height + "px",
        position: 'absolute',
        cursor: props.cursor,
        background: 'rgba(0, 0, 0, 0.0)',
        zIndex: 1000,
        borderWidth: '4px'
    };
}
var EditPosition = /** @class */ (function (_super) {
    __extends(EditPosition, _super);
    function EditPosition(props) {
        var _this = _super.call(this, props) || this;
        _this.addEventListeners = function () {
            document.addEventListener('mouseup', _this.onHtmlMouseUp);
            document.addEventListener('mousemove', _this.onHtmlMouseMove);
            document.addEventListener('touchmove', _this.onHtmlTouchMove);
        };
        _this.removeEventListeners = function () {
            document.removeEventListener('mouseup', _this.onHtmlMouseUp);
            document.removeEventListener('mousemove', _this.onHtmlMouseMove);
            document.removeEventListener('touchmove', _this.onHtmlTouchMove);
        };
        _this.push = function () {
            // this goes on the undo/redo stack
            // the editor is stores the state needed
            // or it will be added to IUndo
            return { editor: _this };
        };
        _this.onMouseDown = function (event) {
            if (event) {
                event.preventDefault();
                _this.addEventListeners();
                _this.initUpdate(event.clientX, event.clientY);
            }
        };
        _this.onHtmlMouseMove = function (event) {
            if (event) {
                event.preventDefault();
                _this.moveUpdate(event.clientX, event.clientY);
            }
        };
        _this.onHtmlMouseUp = function (event) {
            if (event) {
                event.preventDefault();
                _this.removeEventListeners();
                var layout = _this._clonedLayout.generator.lookup(_this._clonedLayout.name);
                var r = layout.rect();
                layout.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
                _this._clonedLayout = layout.clone();
                _this.props.onUpdate(true);
            }
        };
        _this.onHtmlTouchMove = function (event) {
            // TODO implement support for touch
        };
        _this.render = function () {
            return (React.createElement("div", { style: editStyle({ cursor: _this.props.edit.cursor, handle: _this._handle }), onMouseDown: _this.onMouseDown }));
        };
        _this._clonedLayout = _this.props.layout.clone();
        _this._startOrigin = { x: 0, y: 0 };
        if (_this.props.edit.updateHandle) {
            var r = props.layout.rect();
            _this._handle = _this.props.edit.updateHandle(r);
        }
        return _this;
    }
    EditPosition.prototype.initUpdate = function (x, y) {
        this._startOrigin = { x: x, y: y };
    };
    EditPosition.prototype.moveUpdate = function (x, y) {
        var deltaX = x - this._startOrigin.x;
        var deltaY = y - this._startOrigin.y;
        if (deltaX || deltaY) {
            // 1 Extend
            var r = this._clonedLayout.rect();
            var ur = this.props.edit.extendElement(r, deltaX, deltaY);
            // 2 Pin
            if (ur.x < this.props.boundary.x) {
                ur.x = this.props.boundary.x;
            }
            if ((ur.x + ur.width) > (this.props.boundary.x + this.props.boundary.width)) {
                ur.x = this.props.boundary.x + this.props.boundary.width - ur.width;
            }
            if (ur.y < this.props.boundary.y) {
                ur.y = this.props.boundary.y;
            }
            if ((ur.y + ur.height) > (this.props.boundary.y + this.props.boundary.height)) {
                ur.y = this.props.boundary.y + this.props.boundary.height - ur.height;
            }
            // 3 Make live
            var name_1 = this._clonedLayout.name;
            var layout = this._clonedLayout.generator.layouts().get(name_1);
            layout.update({ x: ur.x, y: ur.y }, { width: ur.width, height: ur.height });
            // update params if needed
            if (this.props.edit.updateParam) {
                var p = this.props.edit.updateParam(ur, this.props.edit);
                if (p) {
                    layout.generator.params().set(p.name, p.value);
                }
            }
            // 4 Update handle
            this._handle = this.props.edit.updateHandle(ur);
            this.props.onUpdate();
        }
    };
    return EditPosition;
}(React.Component));
exports.default = EditPosition;
//# sourceMappingURL=EditPosition.js.map