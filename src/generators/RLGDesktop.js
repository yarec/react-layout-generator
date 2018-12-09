"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Generator_1 = require("../generators/Generator");
var Layouts_1 = require("../components/Layouts");
var Params_1 = require("../components/Params");
function updateParamWidth(updated, edit) {
    return {
        name: edit.variable,
        value: updated.width
    };
}
function updateParamHeight(updated, edit) {
    return {
        name: edit.variable,
        value: updated.height
    };
}
function RLGDesktop(name, exParams, parent) {
    var _fullWidthHeaders = 0;
    var _titleHeight = 50;
    var _leftSideWidth = 200;
    var _rightSideWidth = 0;
    var _headerHeight = 24;
    var _footerHeight = 24;
    var values = [
        ['viewport', { width: 0, height: 0 }],
        ['fullWidthHeaders', _fullWidthHeaders],
        ['titleHeight', _titleHeight],
        ['leftSideWidth', _leftSideWidth],
        ['rightSideWidth', _rightSideWidth],
        ['headerHeight', _headerHeight],
        ['footerHeight', _footerHeight]
    ];
    var _params = exParams ? exParams.restore(name, values) : new Params_1.default(values);
    function init(g) {
        var params = g.params();
        var viewport = params.get('viewport');
        var fullWidthHeaders = params.get('fullWidthHeaders');
        var titleHeight = params.get('titleHeight');
        var leftSideWidth = params.get('leftSideWidth');
        var rightSideWidth = params.get('rightSideWidth');
        var headerHeight = params.get('headerHeight');
        var footerHeight = params.get('footerHeight');
        if (viewport.width < 600) {
            leftSideWidth = 0;
            rightSideWidth = 0;
        }
        var title = function () {
            var location;
            var size;
            location = {
                x: 0,
                y: 0
            };
            size = {
                width: viewport.width,
                height: titleHeight
            };
            var p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                edit: [
                    { ref: Layout_1.PositionRef.bottom, variable: 'titleHeight', updateParam: updateParamHeight }
                ],
                location: location,
                size: size
            };
            return new Layout_1.default('title', p, g);
        };
        var leftSide = function () {
            var location;
            var size;
            if (fullWidthHeaders) {
                location = {
                    x: 0,
                    y: titleHeight + headerHeight
                };
                size = {
                    width: leftSideWidth,
                    height: viewport.height - titleHeight - footerHeight - headerHeight
                };
            }
            else {
                location = {
                    x: 0,
                    y: 0
                };
                size = {
                    width: leftSideWidth,
                    height: viewport.height - titleHeight
                };
            }
            var p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                edit: [
                    { ref: Layout_1.PositionRef.right, variable: 'leftSideWidth', updateParam: updateParamWidth }
                ],
                location: location,
                size: size
            };
            return new Layout_1.default('leftSide', p, g);
        };
        var rightSide = function () {
            var location;
            var size;
            if (fullWidthHeaders) {
                location = {
                    x: viewport.width - rightSideWidth,
                    y: titleHeight + headerHeight
                };
                size = {
                    width: rightSideWidth,
                    height: viewport.height - titleHeight - footerHeight - headerHeight
                };
            }
            else {
                location = {
                    x: viewport.width - rightSideWidth,
                    y: 0
                };
                size = {
                    width: rightSideWidth,
                    height: viewport.height - titleHeight
                };
            }
            var p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                edit: [
                    { ref: Layout_1.PositionRef.left, variable: 'rightSideWidth', updateParam: updateParamWidth }
                ],
                location: location,
                size: size
            };
            return new Layout_1.default('rightSide', p, g);
        };
        var header = function () {
            var location;
            var size;
            if (fullWidthHeaders) {
                location = {
                    x: 0,
                    y: titleHeight
                };
                size = {
                    width: viewport.width,
                    height: headerHeight
                };
            }
            else {
                location = {
                    x: leftSideWidth,
                    y: titleHeight
                };
                size = {
                    width: viewport.width - leftSideWidth - rightSideWidth,
                    height: headerHeight
                };
            }
            var p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                edit: [
                    { ref: Layout_1.PositionRef.bottom, variable: 'headerHeight', updateParam: updateParamHeight }
                ],
                location: location,
                size: size
            };
            return new Layout_1.default('header', p, g);
        };
        var content = function () {
            var location;
            var size;
            if (fullWidthHeaders) {
                location = {
                    x: leftSideWidth,
                    y: titleHeight + headerHeight
                };
                size = {
                    width: viewport.width - rightSideWidth - leftSideWidth,
                    height: viewport.height - titleHeight - headerHeight - footerHeight
                };
            }
            else {
                location = {
                    x: leftSideWidth,
                    y: headerHeight
                };
                size = {
                    width: viewport.width - rightSideWidth - leftSideWidth,
                    height: viewport.height - titleHeight - footerHeight - headerHeight
                };
            }
            var p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                location: location,
                size: size
            };
            return new Layout_1.default('content', p, g);
        };
        var footer = function () {
            var location;
            var size;
            if (fullWidthHeaders) {
                location = {
                    x: 0,
                    y: viewport.height - footerHeight
                };
                size = {
                    width: viewport.width,
                    height: footerHeight
                };
            }
            else {
                location = {
                    x: leftSideWidth,
                    y: viewport.height - footerHeight
                };
                size = {
                    width: viewport.width - leftSideWidth - rightSideWidth,
                    height: footerHeight
                };
            }
            var p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                edit: [
                    { ref: Layout_1.PositionRef.top, variable: 'footerHeight', updateParam: updateParamHeight }
                ],
                location: location,
                size: size
            };
            return new Layout_1.default('footer', p, g);
        };
        // Return new instance of Layouts
        return new Layouts_1.default([
            [title.name, title()],
            [leftSide.name, leftSide()],
            [rightSide.name, rightSide()],
            [header.name, header()],
            [content.name, content()],
            [footer.name, footer()]
        ]);
    }
    return new Generator_1.default(name, init, _params, undefined, parent);
}
exports.default = RLGDesktop;
//# sourceMappingURL=RLGDesktop.js.map