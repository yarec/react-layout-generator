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
var RLGPanel = (function (_super) {
    __extends(RLGPanel, _super);
    function RLGPanel(props) {
        var _this = _super.call(this, props) || this;
        if (_this.props.container) {
            _this.state = {
                rect: _this.props.container
            };
        }
        else {
            _this.state = {
                rect: { x: 0, y: 0, width: 0, height: 0 }
            };
        }
        return _this;
    }
    RLGPanel.prototype.componentWillReceiveProps = function (props) {
        if (props.container !== this.state.rect) {
            if (props.container) {
                this.setState({
                    rect: props.container
                });
            }
        }
    };
    RLGPanel.prototype.render = function () {
        var args = {
            container: this.state.rect,
            layout: this.props.layout,
            edit: this.props.edit,
            debug: this.props.debug,
            g: this.props.g,
            context: this.props.context,
        };
        return (React.createElement("div", { style: this.props.style }, this.props.children(args)));
    };
    return RLGPanel;
}(React.Component));
exports.default = RLGPanel;
//# sourceMappingURL=RLGPanel.js.map