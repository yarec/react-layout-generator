"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("src/types");
it('DebugOption.errorAll includes none', function () {
    expect(types_1.DebugOptions.errorAll & types_1.DebugOptions.none).toEqual(types_1.DebugOptions.none);
});
it('DebugOption.errorAll includes warning', function () {
    expect(types_1.DebugOptions.errorAll & types_1.DebugOptions.warning).toEqual(types_1.DebugOptions.warning);
});
it('DebugOption.errorAll includes info', function () {
    expect(types_1.DebugOptions.errorAll & types_1.DebugOptions.info).toEqual(types_1.DebugOptions.info);
});
it('DebugOption.error does not include info', function () {
    expect(types_1.DebugOptions.error & types_1.DebugOptions.info).toEqual(types_1.DebugOptions.none);
});
//# sourceMappingURL=DebugOptions.test.js.map