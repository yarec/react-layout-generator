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
var RLGUpdater = /** @class */ (function (_super) {
    __extends(RLGUpdater, _super);
    function RLGUpdater(props) {
        var _this = _super.call(this, props) || this;
        _this._computed = { width: 0, height: 0 };
        _this.setSize = function (element) {
            if (element && _this._layout) {
                if (element.offsetWidth !== _this._computed.width ||
                    element.offsetHeight !== _this._computed.height) {
                    _this._computed.width = element.offsetWidth;
                    _this._computed.height = element.offsetHeight;
                    _this._layout.updateSize({ width: _this._computed.width, height: _this._computed.height });
                    setTimeout(function () { _this.setState({ update: _this.state.update + 1 }); }, 1);
                }
            }
        };
        if (_this.props.parent) {
            _this._layout = _this.props.g ? _this.props.g.lookup(_this.props.parent.name) : undefined;
        }
        return _this;
    }
    RLGUpdater.prototype.render = function () {
        return this.createElement(this.props.children);
    };
    RLGUpdater.prototype.createElement = function (children) {
        // if (this._layout) {
        //   return (
        //     <div
        //       ref={this.setSize}
        //     >
        //     {this.props.children}
        //     </div>
        //   )
        // };
        return null;
    };
    return RLGUpdater;
}(React.Component));
exports.default = RLGUpdater;
//# sourceMappingURL=RLGUpdater.js.map