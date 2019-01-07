"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
var types_1 = require("../types");
function rowsGenerator(gen) {
    var values = [
        ['containersize', { width: 0, height: 0 }],
        ['align', 0],
        ['spread', 0],
        ['itemSize', { width: 24, height: 24 }],
        ['itemMargin', { top: 2, bottom: 2, right: 0, left: 0 }]
    ];
    var _params = gen.exParams ? gen.exParams.restore(name, values) : new Params_1.default({
        name: 'rowsGenerator', initialValues: values
    });
    function init(g) {
        var params = g.params();
        var layouts = g.layouts();
        if (params.changed()) {
            distributeRows(layouts, params);
        }
        return layouts;
    }
    function distributeRows(layouts, params) {
        var containersize = params.get('containersize');
        var margin = params.get('itemMargin');
        var currentHeight = margin.top;
        layouts.map.forEach(function (layout) {
            var rect = layout.rect();
            var leftOffset = (containersize.width / 2 - (rect.width + margin.left + margin.right) / 2);
            layout.update({ x: leftOffset, y: currentHeight }, types_1.rectSize(rect));
            currentHeight += rect.height + margin.top + margin.bottom;
        });
    }
    function create(args) {
        var params = args.g.params();
        var containersize = params.get('containersize');
        var size = params.get('itemSize');
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
                size: size
            };
        }
        var margin = params.get('itemMargin');
        var topOffset = margin.top;
        if (layouts.map.size) {
            var layout = layouts.find(layouts.map.size - 1);
            var r = layout.rect();
            topOffset = r.y + r.height + margin.bottom + margin.top;
        }
        var leftOffset = (containersize.width / 2) - (size.width + margin.left + margin.right) / 2;
        p.location = { x: leftOffset, y: topOffset };
        return layouts.set(args.name, p, args.g);
    }
    return new Generator_1.default(name, init, _params, create, gen.editHelper);
}
exports.default = rowsGenerator;
//# sourceMappingURL=rowsGenerator.js.map