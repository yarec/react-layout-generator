"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
var params = new Params_1.default([
    ['viewport', { width: 0, height: 0 }]
]);
function init(g) {
    return g.layouts();
}
it('returns undefined with no layouts', function () {
    var g = new Generator_1.default(name, init, params);
    expect(g.next()).toBe(undefined);
});
//# sourceMappingURL=Generator.test.js.map