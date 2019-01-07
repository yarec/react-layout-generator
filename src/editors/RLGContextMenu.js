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
require("../assets/styles.css");
var RLGContextMenu = (function (_super) {
    __extends(RLGContextMenu, _super);
    function RLGContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this._onMouseDown = function (e) {
            e.stopPropagation();
        };
        _this._onClick = function (command) {
            return function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (command) {
                    command();
                }
                ;
            };
        };
        _this._init = function () {
            var clickX = _this.props.location.x;
            var clickY = _this.props.location.y;
            if (_this._root.current) {
                var rootW = _this._root.current.offsetWidth;
                var rootH = _this._root.current.offsetHeight;
                var right = (_this.props.bounds.width - clickX) > rootW;
                var left = !right;
                var top_1 = (_this.props.bounds.height - clickY) > rootH;
                var bottom = !top_1;
                if (right) {
                    _this._root.current.style.left = clickX + 5 + "px";
                }
                if (left) {
                    _this._root.current.style.left = clickX - rootW - 5 + "px";
                }
                if (top_1) {
                    _this._root.current.style.top = clickY + 5 + "px";
                }
                if (bottom) {
                    _this._root.current.style.top = clickY - rootH - 5 + "px";
                }
            }
        };
        _this._onHtmlClick = function (event) {
            var wasOutside = false;
            if (event && event.target) {
                wasOutside = !(event.target === _this._root.current);
            }
            if (wasOutside) {
                _this.props.hideMenu();
            }
        };
        _this._root = React.createRef();
        return _this;
    }
    RLGContextMenu.prototype.componentDidMount = function () {
        document.addEventListener('click', this._onHtmlClick);
        this._init();
    };
    ;
    RLGContextMenu.prototype.componentWillUnmount = function () {
        document.removeEventListener('click', this._onHtmlClick);
    };
    RLGContextMenu.prototype.render = function () {
        return (React.createElement("div", { className: 'dropdown', style: { zIndex: this.props.zIndex + 10 } },
            React.createElement("div", { ref: this._root, className: 'dropdown-content' }, this.createChildren())));
    };
    RLGContextMenu.prototype.createChildren = function () {
        var _this = this;
        var jsx = [];
        this.props.commands.forEach(function (c, i) {
            if (c.name === '') {
                jsx.push(React.createElement("hr", { key: "sep" + i, className: 'separator' }));
            }
            else {
                if (c.disabled) {
                    jsx.push(React.createElement("div", { key: c.name, className: 'disabled' }, c.name));
                }
                else {
                    jsx.push(React.createElement("a", { key: c.name, href: '#', onMouseDown: _this._onMouseDown, onClick: _this._onClick(c.command) }, c.name));
                }
            }
        });
        return jsx;
    };
    return RLGContextMenu;
}(React.Component));
exports.default = RLGContextMenu;
//# sourceMappingURL=RLGContextMenu.js.map