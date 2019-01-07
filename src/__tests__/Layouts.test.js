"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Layouts_1 = require("../components/Layouts");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
var params = new Params_1.default({ name: 'layoutTest', initialValues: [
        ['containersize', { width: 1000, height: 1000 }]
    ] });
function init(g) {
    return g.layouts();
}
function create(args) {
    var layout;
    var layouts = args.g.layouts();
    if (layouts) {
        layout = layouts.set('test', args.position, g);
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
    var l = new Layouts_1.default([]);
    l.set('t', p, g);
    var t2 = l.set('t2', p, g);
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
    var l = new Layouts_1.default([]);
    l.set('t1', p, g);
    var t2 = l.set('t2', p, g);
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
    var l = new Layouts_1.default([]);
    l.set('t1', p, g);
    var t2 = l.set('t2', p, g);
    l.set('t3', p, g);
    expect(l.find(1)).toBe(t2);
});
//# sourceMappingURL=Layouts.test.js.map