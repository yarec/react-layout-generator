"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Params_1 = require("../components/Params");
var Generator_1 = require("./Generator");
function dynamicGenerator(name, exParams) {
    var values = [
        ['containersize', { width: 0, height: 0 }]
    ];
    var _params = exParams ? exParams.restore(name, values) : new Params_1.default({
        name: 'dynamicGenerator', initialValues: values
    });
    function init(g) {
        var params = g.params();
        var layouts = g.layouts();
        if (params.changed()) {
            layouts.map.forEach(function (layout) {
                layout.touch();
            });
        }
        return layouts;
    }
    function create(args) {
        if (!args.position) {
            console.error("TODO use default position " + args.name);
        }
        return args.g.layouts().set(args.name, args.position, args.g);
    }
    return new Generator_1.default(name, init, _params, create);
}
exports.default = dynamicGenerator;
//# sourceMappingURL=dynamicGenerator.js.map