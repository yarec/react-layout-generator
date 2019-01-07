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
var types_1 = require("../types");
var utils_1 = require("../utils");
function editStyle(args) {
    return {
        boxSizing: 'border-box',
        transformOrigin: 0,
        transform: "translate(" + args.handle.x + "px, " + args.handle.y + "px)",
        width: args.handle.width + "px",
        height: args.handle.height + "px",
        position: 'absolute',
        cursor: "" + args.cursor,
        background: 'rgba(0, 0, 0, 0.0)',
        zIndex: args.zIndex,
        borderWidth: '4px',
        outline: 'none'
    };
}
var RLGEditLayout = (function (_super) {
    __extends(RLGEditLayout, _super);
    function RLGEditLayout(props) {
        var _this = _super.call(this, props) || this;
        _this._debug = types_1.DebugOptions.none;
        _this._ctrlKey = false;
        _this._altKey = false;
        _this.render = function () {
            if (_this._handle) {
                return (React.createElement("div", { id: _this.props.layout.name, style: editStyle({ cursor: _this.props.edit.cursor, handle: _this._handle, zIndex: _this.props.zIndex }), onMouseDown: _this.onMouseDown, tabIndex: 0 }));
            }
            else {
                return null;
            }
        };
        _this.hideMenu = function () {
            _this.setState({ contextMenu: false });
        };
        _this.redo = function () {
        };
        _this.undo = function () {
            console.log('undo');
        };
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
            return { editor: _this };
        };
        _this.onClick = function (event) {
            if (event.altKey) {
                var fn = _this.props.layout.onClick;
                if (fn) {
                    fn(event);
                }
            }
        };
        _this.onMouseDown = function (event) {
            if (_this._debug & types_1.DebugOptions.mouseEvents) {
                console.log("RLGEditLayout onMouseDown " + event.target['id']);
            }
            if (!_this.state.contextMenu) {
                if (event.button === 2) {
                    event.preventDefault();
                    var currentTargetRect = event.currentTarget.getBoundingClientRect();
                    var offsetX = event.pageX - currentTargetRect.left;
                    var offsetY = event.pageY - currentTargetRect.top;
                    _this._menuLocation = { x: offsetX, y: offsetY };
                }
                else if (event.shiftKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (_this.props.select) {
                        var select = true;
                        if (_this.props.layout.position.editor) {
                            var editor = _this.props.layout.position.editor;
                            select = editor.selectable;
                            if (select === undefined) {
                                select = true;
                            }
                        }
                        if (select) {
                            var alreadySelected = _this.props.select.selected(_this.props.layout.name);
                            if (alreadySelected) {
                                _this.props.select.remove(_this.props.layout);
                            }
                            else {
                                _this.props.select.add(_this.props.layout);
                            }
                            _this.props.onUpdate();
                        }
                    }
                }
                else if (event.altKey) {
                    var fn = _this.props.layout.onClick;
                    if (fn) {
                        fn(event);
                    }
                }
                else {
                    event.stopPropagation();
                    if (_this.props.select) {
                        _this.props.select.clear();
                        _this.props.onUpdate();
                    }
                    _this.setState({ contextMenu: false });
                    _this.addEventListeners();
                    _this._ctrlKey = event.ctrlKey;
                    _this._altKey = event.altKey;
                    _this.initUpdate(event.clientX, event.clientY);
                }
            }
        };
        _this.onTouchDown = function (event) {
        };
        _this.onHtmlMouseMove = function (event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.moveUpdate(event.clientX, event.clientY);
            }
        };
        _this.onHtmlMouseUp = function (event) {
            if (_this.props.debug && (_this.props.debug & types_1.DebugOptions.mouseEvents)) {
                var id = event && event.target && event.target['id'];
                console.log("RLGEditLayout onHtmlMouseUp " + (id ? id : ''));
            }
            if (event) {
                event.preventDefault();
                _this.removeEventListeners();
                if (_this.state.contextMenu) {
                    _this.setState({ contextMenu: false });
                }
                else {
                    var layout = _this.props.layout;
                    var r = layout.rect();
                    layout.update({ x: r.x, y: r.y }, { width: r.width, height: r.height });
                }
                _this.props.onUpdate(true);
            }
        };
        _this.onHtmlTouchMove = function (event) {
        };
        _this.onKeyDown = function (event) {
            if (event && event.ctrlKey) {
                _this.setState({ activateDrag: true });
            }
        };
        _this.onKeyUp = function (event) {
            if (event && event.ctrlKey) {
                _this.setState({ activateDrag: false });
            }
        };
        _this.componentWillReceiveProps = function (props) {
            if (_this.props.edit.updateHandle) {
                _this._handle = _this.props.edit.updateHandle(props.handle);
            }
        };
        _this._startRect = utils_1.clone(_this.props.handle);
        _this._startOrigin = { x: 0, y: 0 };
        _this.state = { activateDrag: false, contextMenu: false };
        if (_this.props.edit.updateHandle) {
            var r = props.layout.rect();
            _this._handle = _this.props.edit.updateHandle(r);
        }
        if (props.debug) {
            _this._debug = props.debug;
        }
        return _this;
    }
    RLGEditLayout.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (this.props.handle.x - nextProps.handle.x || this.props.handle.y - nextProps.handle.y) {
            return true;
        }
        return false;
    };
    RLGEditLayout.prototype.initUpdate = function (x, y) {
        this._startOrigin = { x: x, y: y };
        var r = this.props.layout.rect();
        this._handle = this.props.edit.updateHandle(r);
        this._startRect = utils_1.clone(this.props.handle);
    };
    RLGEditLayout.prototype.moveUpdate = function (x, y) {
        var deltaX = x - this._startOrigin.x;
        var deltaY = y - this._startOrigin.y;
        if (this._ctrlKey) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0;
            }
            else {
                deltaX = 0;
            }
        }
        if (deltaX || deltaY) {
            var r = this._startRect;
            var ur = this.props.edit.extendElement(r, deltaX, deltaY);
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
            if (this.props.debug && (this.props.debug & types_1.DebugOptions.trace)) {
                var name_1 = this.props.layout.name;
                console.log("RLGEditLayout update location " + name_1 + " (x: " + r.x + ", y: " + r.y + ") to (x: " + ur.x + " y: " + ur.y + ")");
            }
            this.props.layout.update({ x: ur.x, y: ur.y }, { width: ur.width, height: ur.height });
            if (this.props.edit.updateParam) {
                var p = this.props.edit.updateParam(ur, this.props.edit, this.props.layout);
                if (p) {
                    this.props.layout.generator.params().set(p.name, p.value);
                }
            }
            this._handle = this.props.edit.updateHandle(ur);
            this.props.onUpdate();
        }
    };
    return RLGEditLayout;
}(React.Component));
exports.default = RLGEditLayout;
//# sourceMappingURL=RLGEditLayout.js.map