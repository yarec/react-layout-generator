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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var RLGPanel = /** @class */ (function (_super) {
    __extends(RLGPanel, _super);
    function RLGPanel(props) {
        var _this = _super.call(this, props) || this;
        if (_this.props.viewport) {
            _this.state = {
                viewport: _this.props.viewport
            };
        }
        else {
            _this.state = {
                viewport: { width: 0, height: 0 }
            };
        }
        return _this;
    }
    RLGPanel.prototype.componentWillReceiveProps = function (props) {
        if (props.viewport !== this.state.viewport) {
            if (props.viewport) {
                this.setState({
                    viewport: props.viewport
                });
            }
        }
    };
    RLGPanel.prototype.render = function () {
        var args = {
            viewport: this.state.viewport,
            parent: this.props.parent,
            edit: this.props.edit,
            g: this.props.g
        };
        return (React.createElement("div", __assign({}, this.props), this.props.children(args)));
    };
    return RLGPanel;
}(React.Component));
exports.default = RLGPanel;
//# sourceMappingURL=RLGPanel.js.map