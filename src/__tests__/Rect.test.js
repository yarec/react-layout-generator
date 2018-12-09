"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
it('size value is a copy', function () {
    var r = new types_1.Rect({ x: 0, y: 0, width: 0, height: 0 });
    var s = r.size;
    s.width = 1;
    expect(r.size).toEqual({ width: 0, height: 0 });
});
it('location value is a copy', function () {
    var r = new types_1.Rect({ x: 0, y: 0, width: 0, height: 0 });
    var l = r.location;
    l.x = 1;
    expect(r.location).toEqual({ x: 0, y: 0 });
});
it('set location updates correctly', function () {
    var r = new types_1.Rect({ x: 0, y: 0, width: 0, height: 0 });
    r.location = { x: 1, y: 0 };
    expect(r.location).toEqual({ x: 1, y: 0 });
});
it('set size updates correctly', function () {
    var r = new types_1.Rect({ x: 0, y: 0, width: 0, height: 0 });
    r.size = { width: 1, height: 0 };
    expect(r.size).toEqual({ width: 1, height: 0 });
});
//# sourceMappingURL=Rect.test.js.map