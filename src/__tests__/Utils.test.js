"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("src/components/Layout");
var utils_1 = require("src/generators/utils");
var utils_2 = require("../utils");
var containersize = { width: 1000, height: 500 };
it('convert toPixel #1', function () {
    var p = utils_2.toPixel({ value: { x: 50, y: 50 }, unit: Layout_1.IUnit.percent }, containersize);
    expect((p.x + p.y)).toEqual(750);
});
it('convert toPixel #2', function () {
    var p = utils_2.toPixel({ value: { x: 50, y: 50 }, unit: Layout_1.IUnit.preserve }, containersize);
    expect((p.x + p.y)).toEqual(500);
});
it('convert toPixel #3', function () {
    var p = utils_2.toPixel({ value: { x: 50, y: 50 }, unit: Layout_1.IUnit.preserve }, containersize);
    expect((p)).toEqual({ x: 250, y: 250 });
});
it('saves params to localStorage', function () {
    utils_1.saveToLocalStorage('test', 'param', { x: 0, y: 0 });
    var v = utils_1.loadFromLocalStorage('test', 'param');
    expect((v)).toEqual({ x: 0, y: 0 });
});
//# sourceMappingURL=Utils.test.js.map