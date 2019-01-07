"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Params_1 = require("../components/Params");
var update_1 = require("../editors/update");
var Generator_1 = require("../generators/Generator");
function desktopGenerator(name, exParams) {
    var _fullWidthHeaders = 0;
    var _titleHeight = 50;
    var _leftSideWidth = 200;
    var _rightSideWidth = 0;
    var _headerHeight = 24;
    var _contentHeaderHeight = 0;
    var _footerHeight = 24;
    var values = [
        ['containersize', { width: 0, height: 0 }],
        ['fullWidthHeaders', _fullWidthHeaders],
        ['titleHeight', _titleHeight],
        ['leftSideWidth', _leftSideWidth],
        ['rightSideWidth', _rightSideWidth],
        ['headerHeight', _headerHeight],
        ['contentHeaderHeight', _contentHeaderHeight],
        ['footerHeight', _footerHeight]
    ];
    var _params = exParams ? exParams.restore(name, values) : new Params_1.default({
        name: 'desktopGenerator', initialValues: values
    });
    function init(g) {
        var params = g.params();
        var layouts = g.layouts();
        var containersize = params.get('containersize');
        var fullWidthHeaders = params.get('fullWidthHeaders');
        var titleHeight = params.get('titleHeight');
        var leftSideWidth = params.get('leftSideWidth');
        var rightSideWidth = params.get('rightSideWidth');
        var headerHeight = params.get('headerHeight');
        var contentHeaderHeight = params.get('contentHeaderHeight');
        var footerHeight = params.get('footerHeight');
        if (containersize.width < 600) {
            leftSideWidth = 0;
            rightSideWidth = 0;
        }
        var location;
        var size;
        var p;
        title();
        leftSide();
        rightSde();
        header();
        contentHeader();
        content();
        footer();
        return layouts;
        function footer() {
            if (fullWidthHeaders) {
                location = {
                    x: 0,
                    y: containersize.height - footerHeight
                };
                size = {
                    width: containersize.width,
                    height: footerHeight
                };
            }
            else {
                location = {
                    x: leftSideWidth,
                    y: containersize.height - footerHeight
                };
                size = {
                    width: containersize.width - leftSideWidth - rightSideWidth,
                    height: footerHeight
                };
            }
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                editor: {
                    edits: [
                        { ref: Layout_1.PositionRef.top, variable: 'footerHeight', updateParam: update_1.updateParamHeight }
                    ]
                },
                location: location,
                size: size
            };
            layouts.set('footer', p, g);
        }
        function content() {
            location = {
                x: leftSideWidth,
                y: titleHeight + headerHeight + contentHeaderHeight
            };
            size = {
                width: containersize.width - rightSideWidth - leftSideWidth,
                height: containersize.height - titleHeight - headerHeight - contentHeaderHeight - footerHeight
            };
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                location: location,
                size: size
            };
            layouts.set('content', p, g);
        }
        function header() {
            if (fullWidthHeaders) {
                location = {
                    x: 0,
                    y: titleHeight
                };
                size = {
                    width: containersize.width,
                    height: headerHeight
                };
            }
            else {
                location = {
                    x: leftSideWidth,
                    y: titleHeight
                };
                size = {
                    width: containersize.width - leftSideWidth - rightSideWidth,
                    height: headerHeight
                };
            }
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                editor: {
                    edits: [
                        { ref: Layout_1.PositionRef.bottom, variable: 'headerHeight', updateParam: update_1.updateParamHeight }
                    ]
                },
                location: location,
                size: size
            };
            layouts.set('header', p, g);
        }
        function contentHeader() {
            location = {
                x: leftSideWidth,
                y: titleHeight + headerHeight
            };
            size = {
                width: containersize.width - leftSideWidth - rightSideWidth,
                height: contentHeaderHeight
            };
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                editor: {
                    edits: [
                        { ref: Layout_1.PositionRef.bottom, variable: 'contentHeaderHeight', updateParam: update_1.updateParamHeight }
                    ]
                },
                location: location,
                size: size
            };
            layouts.set('contentHeader', p, g);
        }
        function rightSde() {
            if (fullWidthHeaders) {
                location = {
                    x: containersize.width - rightSideWidth,
                    y: titleHeight + headerHeight
                };
                size = {
                    width: rightSideWidth,
                    height: containersize.height - titleHeight - footerHeight - headerHeight
                };
            }
            else {
                location = {
                    x: containersize.width - rightSideWidth,
                    y: 0
                };
                size = {
                    width: rightSideWidth,
                    height: containersize.height - titleHeight
                };
            }
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                editor: {
                    edits: [
                        { ref: Layout_1.PositionRef.left, variable: 'rightSideWidth', updateParam: update_1.updateParamWidth }
                    ]
                },
                location: location,
                size: size
            };
            layouts.set('rightSide', p, g);
        }
        function leftSide() {
            if (fullWidthHeaders) {
                location = {
                    x: 0,
                    y: titleHeight + headerHeight
                };
                size = {
                    width: leftSideWidth,
                    height: containersize.height - titleHeight - footerHeight - headerHeight
                };
            }
            else {
                location = {
                    x: 0,
                    y: 0
                };
                size = {
                    width: leftSideWidth,
                    height: containersize.height - titleHeight
                };
            }
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                editor: {
                    edits: [
                        {
                            ref: Layout_1.PositionRef.right,
                            variable: 'leftSideWidth',
                            updateParam: update_1.updateParamWidth
                        }
                    ]
                },
                location: location,
                size: size
            };
            layouts.set('leftSide', p, g);
        }
        function title() {
            location = {
                x: 0,
                y: 0
            };
            size = {
                width: containersize.width,
                height: titleHeight
            };
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                editor: {
                    edits: [
                        {
                            ref: Layout_1.PositionRef.bottom, variable: 'titleHeight', updateParam: update_1.updateParamHeight,
                        }
                    ]
                },
                location: location,
                size: size
            };
            layouts.set('title', p, g);
        }
    }
    function create(args) {
        if (!args.position) {
            console.error("TODO default position " + args.name);
        }
        return args.g.layouts().set(args.name, args.position, args.g);
    }
    return new Generator_1.default(name, init, _params, create);
}
exports.default = desktopGenerator;
//# sourceMappingURL=desktopGenerator.js.map