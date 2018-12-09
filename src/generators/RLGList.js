"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
function RLGList(name, exParams, parent) {
    var _titleHeight = 34;
    var _itemHeight = 24;
    var values = [
        ['viewport', { width: 0, height: 0 }],
        ['titleHeight', _titleHeight],
        ['itemHeight', _itemHeight]
    ];
    var _params = exParams ? exParams.restore(name, values) : new Params_1.default(values);
    function init(g) {
        var params = g.params();
        var layouts = g.layouts();
        if (params.changed()) {
            // update Layout for each update
            layouts.map.forEach(function (layout) {
                layout.touch();
            });
        }
        return layouts;
    }
    function create(args) {
        var params = args.g.params();
        var viewport = params.get('viewport');
        var titleHeight = params.get('titleHeight');
        var itemHeight = params.get('itemHeight');
        var p = args.position;
        if (!p) {
            p = {
                units: {
                    origin: { x: 0, y: 0 },
                    location: Layout_1.IUnit.pixel,
                    size: Layout_1.IUnit.pixel
                },
                align: {
                    key: args.index - 1,
                    offset: { x: 0, y: 0 },
                    source: { x: 0, y: 100 },
                    self: { x: 0, y: 0 }
                },
                location: { x: 5, y: 0 },
                size: { width: viewport.width, height: args.index === 0 ? titleHeight : itemHeight }
            };
        }
        var l = new Layout_1.default(name, p, args.g);
        args.g.layouts().set(name, l);
        return l;
    }
    return new Generator_1.default(name, init, _params, create, parent);
}
exports.default = RLGList;
//# sourceMappingURL=RLGList.js.map