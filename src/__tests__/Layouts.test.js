"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Layouts_1 = require("../components/Layouts");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
var params = new Params_1.default([
    ['viewport', { width: 1000, height: 1000 }]
]);
function init(g) {
    return g.layouts();
}
function create(args) {
    var layout = new Layout_1.default('test', args.position, g);
    var layouts = args.g.layouts();
    if (layouts) {
        layouts.set(name, layout);
    }
    return layout;
}
var g = new Generator_1.default(name, init, params, create);
it('Layouts index returns the correct key value #1', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var t = new Layout_1.default('test', p, g);
    var l = new Layouts_1.default([['a', t]]);
    expect(l.find(0)).toBe(t);
});
it('Layouts index returns the correct key value #2', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var t = new Layout_1.default('t', p, g);
    var l = new Layouts_1.default([['t', t]]);
    var t2 = new Layout_1.default('t2', p, g);
    l.set('t2', t2);
    expect(l.find(1)).toBe(t2);
});
it('Layouts index returns the correct key value #3', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var t1 = new Layout_1.default('t1', p, g);
    var t2 = new Layout_1.default('t2', p, g);
    var l = new Layouts_1.default([]);
    l.set('t1', t1);
    l.set('t2', t2);
    expect(l.find(1)).toBe(t2);
});
it('Layouts index returns the correct key value #4', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var t1 = new Layout_1.default('t1', p, g);
    var t2 = new Layout_1.default('t2', p, g);
    var t3 = new Layout_1.default('t3', p, g);
    var l = new Layouts_1.default([]);
    l.set('t1', t1);
    l.set('t2', t2);
    l.set('t3', t3);
    expect(l.find(1)).toBe(t2);
});
//# sourceMappingURL=Layouts.test.js.map