"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Layouts_1 = require("../components/Layouts");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
function RLGColumns(name, exParams, parent) {
    var defaultItemWidth = 100;
    var values = [
        ['viewport', { width: 0, height: 0 }],
        ['align', 0],
        ['spread', 0],
        ['defaultItemWidth', defaultItemWidth]
    ];
    var _params = exParams ? exParams.restore(name, values) : new Params_1.default(values);
    function init(g) {
        // const params = g.params();
        // const layouts = g.layouts();
        // const align = params.get('align') as number;
        // if (params.changed()) {
        // update Layout for each update
        // if (align === 0) {
        //   centerColumns(layouts, params);
        // layouts.map.forEach((layout) => {
        //   console.log(`centerColumns ${layout.name} ${layout.rect().x}`)
        // });
        return new Layouts_1.default([]);
    }
    // }
    /**
     * Align items in center
     */
    function centerColumns(layouts, params) {
        var viewport = params.get('viewport');
        // compute width of all columns
        var totalWidth = 0;
        layouts.map.forEach(function (layout) {
            totalWidth += layout.rect().width;
        });
        if (0 && totalWidth > viewport.width) {
            // Split the layouts and add left and right chevron keys (&laquo and &raquo)
            var keys = layouts.map.keys;
            var i = keys.length - 1;
            while (i >= 0 && totalWidth > viewport.width) {
                var layout = layouts.get(keys[i]);
                totalWidth -= layout.rect().width;
                i -= 1;
            }
        }
        // compute beginning offset
        var offset0 = (viewport.width / 2 - totalWidth / 2);
        // update
        var currentWidths = 0;
        layouts.map.forEach(function (layout) {
            var rect = layout.rect();
            layout.update({ x: offset0 + currentWidths, y: 0 }, { width: rect.width, height: viewport.height });
            currentWidths += rect.width;
        });
    }
    function create(args) {
        // console.log(`centerColumns: create ${args.name}`)
        var params = args.g.params();
        var viewport = params.get('viewport');
        var defaultWidth = params.get('defaultItemWidth');
        var layouts = args.g.layouts();
        var p = args.position;
        // console.log('create width', p.size.width);
        if (!p) {
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                location: { x: 0, y: 0 },
                size: { width: defaultWidth, height: viewport.height }
            };
        }
        var l = new Layout_1.default(args.name, p, args.g);
        layouts.set(args.name, l);
        var align = params.get('align');
        // if ((args.index + 1) === args.count) {
        if (align === 0) {
            centerColumns(layouts, params);
        }
        // }
        return l;
    }
    return new Generator_1.default(name, init, _params, create, parent);
}
exports.default = RLGColumns;
//# sourceMappingURL=RLGColumns.js.map