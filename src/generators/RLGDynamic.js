"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Params_1 = require("../components/Params");
var Generator_1 = require("./Generator");
function RLGDynamic(name, exParams, parent) {
    var values = [
        ['viewport', { width: 0, height: 0 }]
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
        if (!args.position) {
            console.error("TODO default position " + args.name);
        }
        var layout = new Layout_1.default(args.name, args.position, args.g);
        args.g.layouts().set(layout.name, layout);
        return layout;
    }
    return new Generator_1.default(name, init, _params, create, parent);
}
exports.default = RLGDynamic;
//# sourceMappingURL=RLGDynamic.js.map