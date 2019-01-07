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
var RLGContextMenu_1 = require("./editors/RLGContextMenu");
var RLGEditLayout_1 = require("./editors/RLGEditLayout");
var RLGSelect_1 = require("./editors/RLGSelect");
var types_1 = require("./types");
function selectedStyle(rect) {
    var offset = 3;
    var x = rect.x - offset;
    var y = rect.y - offset;
    return {
        boxSizing: 'border-box',
        width: rect.width + offset + offset,
        height: rect.height + offset + offset,
        position: 'absolute',
        transform: "translate(" + x + "px, " + y + "px)",
        transformOrigin: 0,
        borderStyle: 'dotted',
        borderWidth: '2px',
        borderColor: 'gray',
    };
}
exports.selectedStyle = selectedStyle;
function layoutStyle(args) {
    return tileStyle(args.style, args.rect.x, args.rect.y, args.rect.width, args.rect.height, args.position.units.size, args.selected, args.zIndex);
}
exports.layoutStyle = layoutStyle;
function tileStyle(style, x, y, width, height, unit, selected, zIndex) {
    var size = {
        height: height + "px",
        width: width + "px",
    };
    switch (unit) {
        case Layout_1.IUnit.unmanaged: {
            size = {};
            break;
        }
        case Layout_1.IUnit.unmanagedHeight: {
            size = {
                width: width + "px"
            };
            break;
        }
        case Layout_1.IUnit.unmanagedWidth: {
            size = {
                height: height + "px"
            };
            break;
        }
    }
    return __assign({ boxSizing: 'border-box' }, size, { position: 'absolute', transform: "translate(" + x + "px, " + y + "px)", transformOrigin: 0, zIndex: zIndex, overflow: 'hidden' }, style);
}
exports.gInProgress = 0;
var EditOptions;
(function (EditOptions) {
    EditOptions[EditOptions["none"] = 0] = "none";
    EditOptions[EditOptions["all"] = 1] = "all";
})(EditOptions = exports.EditOptions || (exports.EditOptions = {}));
exports.gLayouts = new Map();
var RLGLayout = (function (_super) {
    __extends(RLGLayout, _super);
    function RLGLayout(props) {
        var _this = _super.call(this, props) || this;
        _this._data = new Map();
        _this._edit = EditOptions.none;
        _this._debug = types_1.DebugOptions.none;
        _this._count = 0;
        _this._menuLocation = { x: 0, y: 0 };
        _this._zIndex = 0;
        _this.getBoundingLeftTop = function () {
            var leftTop = { x: 0, y: 0 };
            if (_this._root) {
                var r = _this._root.getBoundingClientRect();
                leftTop.x = r.left;
                leftTop.y = r.top;
            }
            return leftTop;
        };
        _this.onRootRef = function (elt) {
            if (elt) {
                _this._root = elt;
            }
        };
        _this.onWindowResize = function () {
            if (_this.state.devicePixelRatio !== window.devicePixelRatio) {
                if (_this._debug && (_this._debug & types_1.DebugOptions.info)) {
                    var browserZoomLevel = window.devicePixelRatio * 100;
                    console.log("window resize zoom " + browserZoomLevel.toFixed(2) + "% ");
                }
                _this.setState({ devicePixelRatio: window.devicePixelRatio });
            }
        };
        _this.onResize = function (width, height) {
            var w = Math.floor(width * window.devicePixelRatio / _this.state.devicePixelRatio);
            var h = Math.floor(height * window.devicePixelRatio / _this.state.devicePixelRatio);
            if (_this._debug && (_this._debug & types_1.DebugOptions.info)) {
                console.log('\nonResize', _this.props.name, w, h);
            }
            if (_this.state.width !== w || _this.state.height !== h) {
                _this.setState({ width: w, height: h });
            }
        };
        _this.onLayoutResize = function (name) {
            return function (width, height) {
                var layout = _this._g.lookup(name);
                if (layout) {
                    var w = Math.ceil(width);
                    var h = Math.ceil(height);
                    var r = layout.fromSize();
                    if (w === 0) {
                        w = r.width;
                    }
                    if (h === 0) {
                        h = r.height;
                    }
                    if (_this._debug && (_this._debug & types_1.DebugOptions.info)) {
                        console.log('onLayoutResize', name, w, h);
                    }
                    layout.updateSize({ width: w, height: h });
                    _this.setState({ update: _this.state.update + 1 });
                }
            };
        };
        _this.initLayout = function () {
            var p = _this._g.params();
            var e = p.get('editOptions');
            if (e) {
                _this._edit = e;
            }
            var v = p.set('containersize', { width: _this.state.width, height: _this.state.height });
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
            _this._zIndex = 0;
            if (_this._debug && _this._debug & types_1.DebugOptions.data) {
                var params = _this._g.params();
                var containersize = params.get('containersize');
                if (_this._count === 0 && containersize.width && containersize.height) {
                    var layouts = _this._g.layouts();
                    console.log("RLGLayout debug for " + _this.props.name + " with generator " + _this._g.name());
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
            _this._zIndex += 1;
        };
        _this.updatePositionedElement = function (child, index, count, name, position, positionChildren, offset) {
            var c = _this._g.params().get('containersize');
            if (c.width === 0 && c.height === 0) {
                return null;
            }
            var b = _this._g.lookup(name);
            if (!b && _this.props['layouts']) {
                var rl = exports.gLayouts.get(_this.props['layouts']);
                if (rl) {
                }
            }
            if (b) {
                _this._zIndex += 1;
                var rect = b.rect();
                if (_this._debug && (_this._debug & types_1.DebugOptions.trace)) {
                    console.log("updatePositionedElement " + name + " position:", b.position);
                }
                if ((rect.width) && (rect.height)) {
                    var style = tileStyle(child.props.style, rect.x + (offset ? offset.x : 0), rect.y + (offset ? offset.y : 0), rect.width, rect.height, b.units.size, _this._select ? _this._select.selected(name) : false, b.layer(_this._zIndex));
                    var editors = _this.createEditors(child, b, rect);
                    exports.gInProgress -= 1;
                    if (b.positionChildren) {
                        return _this.positionChildren(child, b, name, rect, style);
                    }
                    else {
                        var editProps = _this._edit ? {
                            edit: _this._edit,
                            g: _this.props.g,
                        } : {};
                        var args = {
                            container: rect,
                            layout: b,
                            edit: _this._edit,
                            debug: _this._debug,
                            g: _this.props.g,
                            context: _this._data,
                        };
                        var cc = React.cloneElement(child, __assign({}, child.props, __assign({ key: b.name }, args, editProps, { style: __assign({}, _this.props.style, child.props.style, style) })), child.props.children);
                        var e = void 0;
                        if (_this._select && _this._select.selected(name)) {
                            e = (React.createElement("div", { style: selectedStyle(rect) }));
                        }
                        return (React.createElement(React.Fragment, null,
                            cc,
                            e ? e : null,
                            editors));
                    }
                }
            }
            return null;
        };
        _this.updateUnmanagedElement = function (child, index, count, name, position, positionChildren, offset) {
            var c = _this._g.params().get('containersize');
            if (c.width === 0 && c.height === 0) {
                return null;
            }
            var b = _this._g.lookup(name);
            if (b) {
                _this._zIndex += 1;
                var rect = b.rect();
                var style = tileStyle(child.props.style, rect.x + (offset ? offset.x : 0), rect.y + (offset ? offset.y : 0), rect.width, rect.height, b.units.size, _this._select ? _this._select.selected(name) : false, b.layer(_this._zIndex));
                var jsx = [];
                var children = React.Children.toArray(child.props.children);
                if (b.units.size === Layout_1.IUnit.unmanaged) {
                    children.push(React.createElement(react_resize_detector_1.default, { key: "unmanagedResizeDetector", handleWidth: true, handleHeight: true, onResize: _this.onLayoutResize(name) }));
                }
                if (b.units.size === Layout_1.IUnit.unmanagedHeight) {
                    children.push(React.createElement(react_resize_detector_1.default, { key: "unmanagedResizeDetector", handleWidth: false, handleHeight: true, onResize: _this.onLayoutResize(name) }));
                }
                if (b.units.size === Layout_1.IUnit.unmanagedWidth) {
                    children.push(React.createElement(react_resize_detector_1.default, { key: "unmanagedResizeDetector", handleWidth: true, handleHeight: false, onResize: _this.onLayoutResize(name) }));
                }
                var editProps = _this._edit ? {
                    edit: _this._edit,
                    g: _this.props.g,
                } : {};
                var args = {
                    container: rect,
                    layout: b,
                    edit: _this._edit,
                    debug: _this._debug,
                    g: _this.props.g,
                    context: _this._data,
                };
                var ch = React.cloneElement(child, __assign({}, child.props, __assign({ key: b.name }, args, editProps, { style: __assign({}, _this.props.style, child.props.style, style) })), children);
                if (_this._select && _this._select.selected(name)) {
                    jsx.push(React.createElement("div", { style: selectedStyle(rect) }, ch));
                }
                else {
                    jsx.push(ch);
                }
                var editors = _this.createEditors(child, b, rect);
                return (React.createElement(React.Fragment, null,
                    jsx,
                    editors));
            }
            return null;
        };
        _this.createLayout = function (child, index, count) {
            var p = child.props['data-layout'];
            if (p) {
                if (p.layout && p.name) {
                    var ancestor = exports.gLayouts.get(p.layout);
                    if (ancestor) {
                        return ancestor.createPositionedElement(child, index, count, p.name, p.position, p.context);
                    }
                }
                else if (p.name) {
                    return _this.createPositionedElement(child, index, count, p.name, p.position, p.context);
                }
            }
            return null;
        };
        _this.updateElement = function (child, index, count) {
            var p = child.props['data-layout'];
            if (p) {
                if (p.layout && p.name) {
                    var ancestor = exports.gLayouts.get(p.layout);
                    if (ancestor) {
                        var location_1 = _this.getBoundingLeftTop();
                        var ancestorLocation = ancestor.getBoundingLeftTop();
                        var offset = { x: ancestorLocation.x - location_1.x, y: ancestorLocation.y - location_1.y };
                        var position = p.position;
                        if (position && position.units.size >= Layout_1.IUnit.unmanaged) {
                            return ancestor.updateUnmanagedElement(child, index, count, p.name, p.position, p.context, offset);
                        }
                        return ancestor.updatePositionedElement(child, index, count, p.name, p.position, p.context, offset);
                    }
                }
                else if (p.name) {
                    var position = p.position;
                    if (position && position.units.size >= Layout_1.IUnit.unmanaged) {
                        return _this.updateUnmanagedElement(child, index, count, p.name, p.position, p.context);
                    }
                    return _this.updatePositionedElement(child, index, count, p.name, p.position, p.context);
                }
            }
            return React.Children.map(child.props.children, function (nestedChild) {
                console.error("\n        Child " + nestedChild + " in RLGLayout " + _this.props.name + " will not be rendered.\n        Only RLGLayout children with a data-layout property will be rendered.\n        ");
            });
        };
        _this.onParentMouseDown = function (event) {
            if (_this._debug && (_this._debug & types_1.DebugOptions.mouseEvents)) {
                console.log("RLGLayout onParentMouseDown " + _this.props.name + " " + event.target);
            }
            if (event.button !== 2 &&
                _this._select &&
                _this._select.selected.length) {
                _this._select.clear();
            }
            event.stopPropagation();
            _this.handleContextMenu(event);
        };
        _this.onParentContextMenu = function (layout) {
            return function (event) {
                if (_this._debug && (_this._debug & types_1.DebugOptions.mouseEvents)) {
                    console.log("RLGLayout onParentContextMenu " + _this.props.name + " " + event.target);
                }
                event.preventDefault();
                _this.setState({ contextMenu: layout, contextMenuActive: true });
            };
        };
        _this.generateContextMenu = function (layout) {
            var menuItems = _this._select && _this._select.commands;
            if (layout && layout.editor && layout.editor.contextMenu) {
                var contextMenu = layout.editor.contextMenu;
                menuItems.push({ name: '' });
                contextMenu.forEach(function (item) {
                    menuItems.push(item);
                });
            }
            return menuItems;
        };
        _this.onHtmlMouseUp = function (event) {
            if (event) {
                if (_this._debug && (_this._debug & types_1.DebugOptions.mouseEvents)) {
                    console.log("RLGLayout onHtmlMouseUp " + _this.props.name + " " + event.target);
                }
                event.preventDefault();
                _this.removeEventListeners();
                _this.hideMenu();
            }
        };
        _this.hideMenu = function () {
            if (_this.state.contextMenuActive) {
                _this.setState({ contextMenu: undefined, contextMenuActive: false });
            }
        };
        _this.addEventListeners = function () {
            document.addEventListener('mouseup', _this.onHtmlMouseUp);
        };
        _this.removeEventListeners = function () {
            document.removeEventListener('mouseup', _this.onHtmlMouseUp);
        };
        _this.select = function (instance) {
            _this._select = instance;
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
            if (_this._debug & types_1.DebugOptions.timing) {
                console.log('frameTime: ', (Date.now() - _this._startRendering) + ' ms');
            }
            return null;
        };
        _this.content = function () {
            var count = React.Children.count(_this.props.children);
            exports.gInProgress += count;
            if (_this._debug && (_this._debug & types_1.DebugOptions.trace)) {
                var containersize = _this._g.params().get('containersize');
                console.log("\ncontent " + _this._g.name() + " containersize: " + containersize.width + ", " + containersize.height);
            }
            React.Children.map(_this.props.children, function (child, i) {
                var c = child;
                if (c) {
                    if (c.type === React.Fragment) {
                        React.Children.map(c.props.children, function (nChild, ni) {
                            var nc = nChild;
                            var nCount = React.Children.count(nc.props.children);
                            _this.createLayout(nc, ni, nCount);
                        });
                    }
                    else {
                        _this.createLayout(c, i, count);
                    }
                }
            });
            var elements = (React.Children.map(_this.props.children, function (child, i) {
                var c = child;
                if (c) {
                    if (c.type === React.Fragment) {
                        return React.Children.map(c.props.children, function (nChild, ni) {
                            var nc = nChild;
                            var nCount = React.Children.count(nc.props.children);
                            return _this.updateElement(nc, ni, nCount);
                        });
                    }
                    else {
                        return _this.updateElement(child, i, count);
                    }
                }
                return null;
            }));
            if (_this.props.edit) {
                elements.unshift(React.createElement(RLGSelect_1.default, { name: "select-" + name, key: "select-" + name, debug: _this._debug, select: _this.select, boundary: { x: 0, y: 0, width: _this.state.width, height: _this.state.height }, onUpdate: _this.onUpdate, g: _this._g }));
            }
            elements.push(React.createElement(react_resize_detector_1.default, { key: "contentResizeDetector " + _this.props.name, handleWidth: true, handleHeight: true, onResize: _this.onResize }));
            return elements;
        };
        _this.state = {
            height: 0,
            update: 0,
            width: 0,
            contextMenu: undefined,
            contextMenuActive: false,
            devicePixelRatio: window.devicePixelRatio
        };
        _this.initProps(props);
        return _this;
    }
    RLGLayout.prototype.componentDidMount = function () {
        if (exports.gLayouts.get(this.props.name) !== undefined) {
            console.error("\n      Did you reuse the name " + this.props.name + "?. Each RLGLayout name must be unique.\n      ");
        }
        exports.gLayouts.set(this.props.name, this);
        window.addEventListener('resize', this.onWindowResize);
    };
    RLGLayout.prototype.componentWillUnmount = function () {
        exports.gLayouts.delete(this.props.name);
        window.removeEventListener('resize', this.onWindowResize);
    };
    RLGLayout.prototype.componentWillReceiveProps = function (props) {
        if (this.props.debug !== props.debug ||
            this.props.edit !== props.edit) {
            this.props.g.clear();
            this.initProps(props);
        }
    };
    RLGLayout.prototype.render = function () {
        this.initLayout();
        if (this.props.edit) {
            this.frameStart();
            return (React.createElement("div", { id: 'main', ref: this.onRootRef, style: { height: '100%', width: '100%' }, onMouseDown: this.onParentMouseDown, onContextMenu: this.onParentContextMenu() },
                this.content(),
                (this.state.contextMenuActive) ?
                    React.createElement(RLGContextMenu_1.default, { commands: this.generateContextMenu(this.state.contextMenu), location: this._menuLocation, bounds: { width: this.state.width, height: this.state.height }, debug: this._debug, hideMenu: this.hideMenu, zIndex: this._zIndex })
                    : null,
                this.frameEnd()));
        }
        return (React.createElement("div", { id: 'main', ref: this.onRootRef, style: { height: '100%', width: '100%' } }, this.content()));
    };
    RLGLayout.prototype.initProps = function (props) {
        var _this = this;
        this._edit = props.edit ? props.edit : EditOptions.none;
        this._debug = types_1.DebugOptions.none;
        if (props.debug) {
            if (Array.isArray(props.debug)) {
                var array = props.debug;
                array.forEach(function (option) {
                    _this._debug |= option;
                });
            }
            else {
                this._debug = props.debug;
            }
        }
        this._g = this.props.g;
        if (this.props.params) {
            var params_1 = this._g.params();
            this.props.params.forEach(function (value) {
                params_1.set(value[0], value[1]);
            });
        }
    };
    RLGLayout.prototype.handleContextMenu = function (event) {
        if (event.button === 2) {
            event.preventDefault();
            var currentTargetRect = event.currentTarget.getBoundingClientRect();
            var offsetX = event.pageX - currentTargetRect.left;
            var offsetY = event.pageY - currentTargetRect.top;
            this._menuLocation = { x: offsetX, y: offsetY };
            this.addEventListeners();
        }
        else {
            this.hideMenu();
        }
    };
    RLGLayout.prototype.positionChildren = function (child, b, name, rect, style) {
        var _this = this;
        var editProps = {
            edit: this._edit,
            g: this.props.g,
        };
        var nestedChildren = React.Children.map(child.props.children, function (nestedChild, i) {
            var nestedLayout = b.positionChildren(b, b.generator, i);
            if (nestedLayout) {
                var nestedRect = nestedLayout.rect();
                var nestedStyle = tileStyle(nestedChild.props.style, nestedRect.x, nestedRect.y, nestedRect.width, nestedRect.height, b.units.size, _this._select ? _this._select.selected(name) : false, b.layer(_this._zIndex));
                var nArgs = {
                    container: nestedRect,
                    layout: b,
                    edit: _this._edit,
                    debug: _this._debug,
                    g: _this.props.g,
                    context: _this._data,
                };
                return (React.cloneElement(nestedChild, __assign({}, nestedChild.props, __assign({ key: "" + nestedChild.key }, nArgs, editProps, { style: __assign({}, _this.props.style, nestedChild.props.style, nestedStyle) })), nestedChild.props.children));
            }
            return null;
        });
        var args = {
            container: rect,
            layout: b,
            edit: this._edit,
            debug: this._debug,
            g: this.props.g,
            context: this._data,
        };
        return (React.cloneElement(child, __assign({}, child.props, __assign({ key: b.name }, args, editProps, { style: __assign({}, this.props.style, child.props.style, style) })), nestedChildren));
    };
    RLGLayout.prototype.createEditors = function (child, b, rect) {
        var _this = this;
        var editors = [];
        if (this._edit) {
            if (child.props.onMouseDown) {
                var fn = child.props.onMouseDown;
                b.onMouseDown = fn;
            }
            if (child.props.onClick) {
                var fn = child.props.onClick;
                b.onClick = fn;
            }
            if (b.editor && b.editor.edits) {
                var allow_1 = true;
                b.editor.edits.forEach(function (item, i) {
                    if (b.units.size === Layout_1.IUnit.unmanagedWidth &&
                        (item.ref === Layout_1.PositionRef.bottom || item.ref === Layout_1.PositionRef.top)) {
                        allow_1 = false;
                    }
                    if (b.units.size === Layout_1.IUnit.unmanagedHeight &&
                        (item.ref === Layout_1.PositionRef.left || item.ref === Layout_1.PositionRef.right)) {
                        allow_1 = false;
                    }
                    if (allow_1) {
                        editors.push(React.createElement(RLGEditLayout_1.default, { key: "edit" + (b.name + i), edit: item, layout: b, debug: _this._debug, select: _this._select, handle: rect, boundary: { x: 0, y: 0, width: _this.state.width, height: _this.state.height }, onUpdate: _this.onUpdate, zIndex: b.layer(_this._zIndex) }));
                    }
                    else {
                        console.error("Cannot edit " + Layout_1.namedPositionRef(item.ref) + " for layout \n            " + name + " when size is set to \n            " + Layout_1.namedUnit(b.units.size));
                    }
                });
            }
            else {
                var edit = { ref: Layout_1.PositionRef.position };
                b.setEditDefaults(edit);
                editors.push(React.createElement(RLGEditLayout_1.default, { key: "edit" + b.name, edit: edit, layout: b, debug: this._debug, select: this._select, handle: rect, boundary: { x: 0, y: 0, width: this.state.width, height: this.state.height }, onUpdate: this.onUpdate, zIndex: b.layer(this._zIndex) }));
            }
        }
        return editors;
    };
    return RLGLayout;
}(React.Component));
exports.default = RLGLayout;
//# sourceMappingURL=RLGLayout.js.map