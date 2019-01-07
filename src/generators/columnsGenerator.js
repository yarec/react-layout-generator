"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Layouts_1 = require("../components/Layouts");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
function columnsGenerator(name, exParams) {
    var defaultItemWidth = 100;
    var values = [
        ['containersize', { width: 0, height: 0 }],
        ['align', 0],
        ['spread', 0],
        ['itemSize', { width: defaultItemWidth, height: 0 }]
    ];
    var _params = exParams ? exParams.restore(name, values) : new Params_1.default({
        name: 'columnsGenerator', initialValues: values
    });
    function init(g) {
        return new Layouts_1.default([]);
    }
    function centerColumns(layouts, params) {
        var containersize = params.get('containersize');
        var totalWidth = 0;
        layouts.map.forEach(function (layout) {
            totalWidth += layout.rect().width;
        });
        var offset0 = (containersize.width / 2 - totalWidth / 2);
        var currentWidth = 0;
        layouts.map.forEach(function (layout) {
            var rect = layout.rect();
            layout.update({ x: offset0 + currentWidth, y: 0 }, { width: rect.width, height: containersize.height });
            currentWidth += rect.width;
        });
    }
    function create(args) {
        var params = args.g.params();
        var containersize = params.get('containersize');
        var itemSize = params.get('itemSize');
        var layouts = args.g.layouts();
        var p = args.position;
        if (!p) {
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                location: { x: 0, y: 0 },
                size: { width: itemSize.width, height: containersize.height }
            };
        }
        var l = layouts.set(args.name, p, args.g);
        var align = params.get('align');
        if (align === 0) {
            centerColumns(layouts, params);
        }
        return l;
    }
    return new Generator_1.default(name, init, _params, create);
}
exports.default = columnsGenerator;
//# sourceMappingURL=columnsGenerator.js.map