"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var Params_1 = require("../components/Params");
var Generator_1 = require("../generators/Generator");
var params = new Params_1.default({ name: 'layoutTest', initialValues: [
        ['containersize', { width: 1000, height: 1000 }]
    ] });
function init(_g) {
    return _g.layouts();
}
function create(args) {
    var layout;
    var layouts = args.g.layouts();
    if (layouts) {
        layout = layouts.set('test', args.position, args.g);
    }
    return layout;
}
var g = new Generator_1.default(name, init, params, create);
it('location #1 - default units', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromLocation()).toEqual({ x: 0, y: 10 });
});
it('location #2 - location in percent', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 50, y: 50 },
        size: { width: 10, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromLocation()).toEqual({ x: 500, y: 500 });
});
it('location #3', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 50, y: 50 },
        size: { width: 10, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromLocation()).toEqual({ x: 500, y: 500 });
});
it('location #4', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 50, y: 50 },
        size: { width: 10, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromLocation()).toEqual({ x: 495, y: 495 });
});
it('size #1', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromSize()).toEqual({ width: 100, height: 10 });
});
it('size #2', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromSize()).toEqual({ width: 100, height: 10 });
});
it('size #3', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 50, y: 50 },
        size: { width: 100, height: 100 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromSize()).toEqual({ width: 100, height: 100 });
});
it('size #4', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.percent
        },
        location: { x: 50, y: 50 },
        size: { width: 10, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.fromSize()).toEqual({ width: 100, height: 100 });
});
it('rect #1', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 0, y: 10 },
        size: { width: 100, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.rect()).toEqual({ x: 0, y: 10, width: 100, height: 10 });
});
it('rect #2', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 500, y: 500 },
        size: { width: 100, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.rect()).toEqual({ x: 450, y: 495, width: 100, height: 10 });
});
it('rect #3', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 50, y: 50 },
        size: { width: 100, height: 10 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.rect()).toEqual({ x: 450, y: 495, width: 100, height: 10 });
});
it('rect #4', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.percent
        },
        location: { x: 50, y: 50 },
        size: { width: 10, height: 5 }
    };
    var l = new Layout_1.default('test', p, g);
    expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 });
});
it('update #1', function () {
    var p = {
        units: {
            origin: { x: 50, y: 50 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.percent
        },
        location: { x: 50, y: 50 },
        size: { width: 10, height: 5 }
    };
    var l = new Layout_1.default('test', p, g);
    l.update({ x: 450, y: 475 }, { width: 100, height: 50 });
    expect(l.rect()).toEqual({ x: 450, y: 475, width: 100, height: 50 });
});
it('update #2', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.pixel,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 250, y: 250 },
        size: { width: 100, height: 50 }
    };
    var l = new Layout_1.default('test', p, g);
    l.update({ x: 250, y: 250 }, { width: 50, height: 50 });
    expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 });
});
it('update #3', function () {
    var p = {
        units: {
            origin: { x: 0, y: 0 },
            location: Layout_1.IUnit.percent,
            size: Layout_1.IUnit.pixel
        },
        location: { x: 250, y: 250 },
        size: { width: 100, height: 50 }
    };
    var l = new Layout_1.default('test', p, g);
    l.update({ x: 250, y: 250 }, { width: 50, height: 50 });
    expect(l.rect()).toEqual({ x: 250, y: 250, width: 50, height: 50 });
});
//# sourceMappingURL=Layout.test.js.map