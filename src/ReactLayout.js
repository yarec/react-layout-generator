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
var react_resize_detector_1 = require("react-resize-detector");
var Layout_1 = require("./components/Layout");
var EditPosition_1 = require("./editors/EditPosition");
function tileStyle(style, x, y, width, height, unit) {
    switch (unit) {
        case Layout_1.IUnit.unmanaged: {
            return __assign({ boxSizing: 'border-box', position: 'absolute', transform: "translate(" + x + "px, " + y + "px)", transformOrigin: 0 }, style);
        }
        case Layout_1.IUnit.unmanagedHeight: {
            return __assign({ boxSizing: 'border-box', position: 'absolute', transform: "translate(" + x + "px, " + y + "px)", transformOrigin: 0, width: width + "px" }, style);
        }
        case Layout_1.IUnit.unmanagedWidth: {
            return __assign({ boxSizing: 'border-box', position: 'absolute', transform: "translate(" + x + "px, " + y + "px)", transformOrigin: 0, height: height + "px" }, style);
        }
    }
    return __assign({ boxSizing: 'border-box', height: height + "px", position: 'absolute', transform: "translate(" + x + "px, " + y + "px)", transformOrigin: 0, width: width + "px" }, style);
}
exports.gInProgress = 0;
var EditOptions;
(function (EditOptions) {
    EditOptions[EditOptions["none"] = 0] = "none";
    EditOptions[EditOptions["all"] = 1] = "all";
})(EditOptions = exports.EditOptions || (exports.EditOptions = {}));
var DebugOptions;
(function (DebugOptions) {
    DebugOptions[DebugOptions["none"] = 0] = "none";
    // tslint:disable-next-line:no-bitwise
    DebugOptions[DebugOptions["info"] = 1] = "info";
    // tslint:disable-next-line:no-bitwise
    DebugOptions[DebugOptions["data"] = 2] = "data";
    // tslint:disable-next-line:no-bitwise
    DebugOptions[DebugOptions["warning"] = 4] = "warning";
    // tslint:disable-next-line:no-bitwise
    DebugOptions[DebugOptions["error"] = 8] = "error";
    // tslint:disable-next-line:no-bitwise
    DebugOptions[DebugOptions["all"] = 15] = "all";
})(DebugOptions = exports.DebugOptions || (exports.DebugOptions = {}));
var ReactLayout = /** @class */ (function (_super) {
    __extends(ReactLayout, _super);
    function ReactLayout(props) {
        var _this = _super.call(this, props) || this;
        _this._edit = EditOptions.none;
        _this._count = 0;
        _this.getWidth = function () {
            return _this.state.width;
        };
        _this.onResize = function (width, height) {
            var w = Math.floor(width);
            var h = Math.floor(height);
            // tslint:disable-next-line:no-bitwise
            if (_this.props.debug && (_this.props.debug & DebugOptions.info)) {
                console.log('onResize', _this.props.name, w, h);
            }
            if (_this.state.width !== w || _this.state.height !== h) {
                _this.setState({ width: w, height: h });
            }
        };
        _this.onLayoutResize = function (name) {
            // Use closure to determine layout to update
            return function (width, height) {
                var layout = _this._g.lookup(name);
                if (layout) {
                    var w = Math.ceil(width);
                    var h = Math.ceil(height);
                    // tslint:disable-next-line:no-bitwise
                    if (_this.props.debug && (_this.props.debug & DebugOptions.info)) {
                        console.log('onLayoutResize', name, w, h);
                    }
                    layout.updateSize({ width: w, height: h });
                    // TODO: Just fire update for unmanaged element
                    _this.setState({ update: _this.state.update + 1 });
                }
            };
        };
        _this.initLayout = function () {
            var p = _this._g.params();
            var v = p.set('viewport', { width: _this.state.width, height: _this.state.height });
            if (v) {
                var layouts = _this._g.layouts();
                if (layouts) {
                    layouts.map.forEach(function (layout) {
                        layout.touch();
                        layout.rect();
                    });
                }
            }
            _this._g.reset();
            // tslint:disable-next-line:no-bitwise
            if (_this.props.debug && _this.props.debug & DebugOptions.data) {
                var params = _this._g.params();
                var viewport = params.get('viewport');
                if (_this._count === 0 && viewport.width && viewport.height) {
                    var layouts = _this._g.layouts();
                    console.log("ReactLayout debug for " + _this.props.name + " with generator " + _this._g.name());
                    console.log('params');
                    params.map.forEach(function (value, key) {
                        console.log("  " + key + " " + JSON.stringify(value));
                    });
                    console.log('layouts (computed position rects)');
                    layouts.map.forEach(function (value, key) {
                        var r = value.rect();
                        console.log("  " + key + " x: " + r.x + " y: " + r.y + " width: " + r.width + " height: " + r.height);
                    });
                    _this._count += 1;
                }
            }
        };
        _this.createPositionedElement = function (child, index, count, name, position, positionChildren) {
            var b = _this._g.lookup(name);
            if (!b && _this._g.create) {
                b = _this._g.create({
                    index: index,
                    count: count,
                    name: name,
                    g: _this._g,
                    position: position
                });
            }
        };
        _this.updatePositionedElement = function (child, index, count, name, position, positionChildren) {
            var b = _this._g.lookup(name);
            if (b) {
                var rect = b.rect();
                if ((rect.width) && (rect.height)) {
                    var style = tileStyle(child.props.style, rect.x, rect.y, rect.width, rect.height, b.units.size);
                    var editors_1 = [];
                    if (_this._edit && b.edit) {
                        var i_1 = 0;
                        b.edit.forEach(function (item) {
                            editors_1.push(React.createElement(EditPosition_1.default, { key: "edit" + i_1, edit: item, layout: b, boundary: { x: 0, y: 0, width: _this.state.width, height: _this.state.height }, onUpdate: _this.onUpdate }));
                            i_1 += 1;
                        });
                    }
                    exports.gInProgress -= 1;
                    if (b && b.positionChildren) {
                        var nestedChildren = React.Children.map(child.props.children, function (nestedChild, i) {
                            var nestedLayout = b.positionChildren(b, b.generator, i);
                            if (nestedLayout) {
                                var nestedRect = nestedLayout.rect();
                                var nestedStyle = tileStyle(nestedChild.props.style, nestedRect.x, nestedRect.y, nestedRect.width, nestedRect.height, b.units.size);
                                return (React.cloneElement(nestedChild, {
                                    key: "" + nestedChild.key,
                                    viewport: { width: nestedRect.width, height: nestedRect.height },
                                    parent: {
                                        name: name,
                                        position: b.position
                                    },
                                    edit: _this.props.edit,
                                    g: _this.props.g,
                                    style: __assign({}, _this.props.style, nestedChild.props.style, nestedStyle)
                                }, nestedChild.props.children));
                            }
                            return null;
                        });
                        return (React.cloneElement(child, {
                            key: b.name,
                            viewport: { width: rect.width, height: rect.height },
                            parent: {
                                name: name,
                                position: b.position
                            },
                            edit: _this.props.edit,
                            g: _this.props.g,
                            style: __assign({}, _this.props.style, child.props.style, style)
                        }, nestedChildren));
                    }
                    else {
                        return (React.createElement(React.Fragment, null,
                            React.cloneElement(child, {
                                key: b.name,
                                viewport: { width: rect.width, height: rect.height },
                                parent: {
                                    name: name,
                                    position: b.position
                                },
                                edit: _this.props.edit,
                                g: _this.props.g,
                                style: __assign({}, _this.props.style, child.props.style, style)
                            }, child.props.children),
                            editors_1));
                    }
                }
            }
            return null;
        };
        _this.updateUnmanagedElement = function (child, index, count, name, position, positionChildren) {
            var b = _this._g.lookup(name);
            if (b) {
                var rect = b.rect();
                var style = tileStyle(child.props.style, rect.x, rect.y, rect.width, rect.height, b.units.size);
                var jsx_1 = [];
                var children = React.Children.toArray(child.props.children);
                children.push(React.createElement(react_resize_detector_1.default, { key: "unmanagedResizeDetector", handleWidth: true, handleHeight: true, onResize: _this.onLayoutResize(name) }));
                var ch = React.cloneElement(child, {
                    key: b.name,
                    viewport: { width: rect.width, height: rect.height },
                    parent: {
                        name: name,
                        position: b.position
                    },
                    edit: _this.props.edit,
                    g: _this.props.g,
                    style: __assign({}, _this.props.style, child.props.style, style)
                }, children);
                jsx_1.push(ch);
                if (_this._edit && b.edit) {
                    var i_2 = 0;
                    b.edit.forEach(function (item) {
                        var allow = false;
                        if (item.ref === Layout_1.PositionRef.position) {
                            allow = true;
                        }
                        if ((item.ref === Layout_1.PositionRef.bottom || item.ref === Layout_1.PositionRef.top) &&
                            b.units.size === Layout_1.IUnit.unmanagedWidth) {
                            allow = true;
                        }
                        if ((item.ref === Layout_1.PositionRef.left || item.ref === Layout_1.PositionRef.right) &&
                            b.units.size === Layout_1.IUnit.unmanagedHeight) {
                            allow = true;
                        }
                        if (allow) {
                            jsx_1.push(React.createElement('EditPosition', {
                                key: "edit" + i_2,
                                edit: item,
                                layout: b,
                                boundary: { x: 0, y: 0, width: _this.state.width, height: _this.state.height },
                                onUpdate: _this.onUpdate
                            }));
                            i_2 += 1;
                        }
                        else {
                            console.error("Cannot edit " + Layout_1.namedPositionRef(item.ref) + " \n            for layout " + name + " when size is set to " + Layout_1.namedUnit(b.units.size));
                        }
                    });
                }
                return (React.createElement(React.Fragment, null, jsx_1));
            }
            return null;
        };
        _this.createLayout = function (child, index, count) {
            var p = child.props['data-layout'];
            if (p && p.name) {
                return _this.createPositionedElement(child, index, count, p.name, p.position, p.context);
            }
            else {
                // TODO add support for elements without 'data-layout'
                // Is it needed?
                // Pass height width props of container to each child and its children
            }
            return null;
        };
        _this.updateElement = function (child, index, count) {
            var p = child.props['data-layout'];
            if (p && p.name) {
                var position = p.position;
                if (position && position.units.size >= Layout_1.IUnit.unmanaged) {
                    // size determined by element.offsetWidth and element offsetHeight
                    return _this.updateUnmanagedElement(child, index, count, p.name, p.position, p.context);
                }
                return _this.updatePositionedElement(child, index, count, p.name, p.position, p.context);
            }
            else {
                // TODO add support for elements without 'data-layout'
                // Is it needed?
                React.Children.map(child.props.children, function (nestedChild) {
                    return nestedChild;
                });
            }
            return null;
        };
        _this.onUpdate = function (reset) {
            if (reset === void 0) { reset = false; }
            if (reset) {
                _this.setState({ update: 0 });
            }
            else {
                _this.setState({ update: _this.state.update + 1 });
            }
        };
        _this.frameStart = function () {
            _this._startRendering = Date.now();
            return null;
        };
        _this.frameEnd = function () {
            console.log('frameTime: ', (Date.now() - _this._startRendering) + ' ms');
            return null;
        };
        _this.content = function () {
            var count = React.Children.count(_this.props.children);
            exports.gInProgress += count;
            // Phase I create if necessary
            React.Children.map(_this.props.children, function (child, i) {
                if (child) {
                    // tslint:disable-next-line:no-any
                    _this.createLayout(child, i, count);
                }
            });
            // Phase II update
            var elements = (React.Children.map(_this.props.children, function (child, i) {
                if (child) {
                    // tslint:disable-next-line:no-any
                    return _this.updateElement(child, i, count);
                }
                return null;
            }));
            elements.push(React.createElement(react_resize_detector_1.default, { key: "contentResizeDetector " + _this.props.name, handleWidth: true, handleHeight: true, onResize: _this.onResize }));
            return elements;
        };
        _this.state = {
            height: 0,
            update: 0,
            width: 0
        };
        _this._edit = props.edit ? props.edit : EditOptions.none;
        _this._g = _this.props.g;
        return _this;
    }
    ReactLayout.prototype.render = function () {
        this.frameStart();
        this.initLayout();
        // this.state.update can be used for debug tracing during or after editing
        // if (this.state.update === 0) {
        //   console.log('render');
        // }
        return (
        /* style height of 100% necessary for ReactResizeDetector to work  */
        React.createElement("div", { style: { height: '100%' } },
            this.content(),
            this.frameEnd()));
    };
    return ReactLayout;
}(React.Component));
exports.default = ReactLayout;
//# sourceMappingURL=ReactLayout.js.map