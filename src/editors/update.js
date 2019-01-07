"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
function updateParamLocation(updated, edit, layout) {
    var factor = 1;
    if (layout.units.location !== Layout_1.IUnit.pixel) {
        factor = 100;
    }
    return {
        name: edit.variable,
        value: { x: layout.position.location.x * factor, y: layout.position.location.y * factor }
    };
}
exports.updateParamLocation = updateParamLocation;
function updateParamOffset(updated, edit, layout) {
    var factor = 1;
    if (layout.units.location !== Layout_1.IUnit.pixel) {
        factor = 100;
    }
    return {
        name: edit.variable,
        value: { x: layout.position.align.offset.x * factor, y: layout.position.align.offset.y * factor }
    };
}
exports.updateParamOffset = updateParamOffset;
function updateParamWidth(updated, edit, layout) {
    var factor = 1;
    if (layout.units.size !== Layout_1.IUnit.pixel) {
        factor = 100;
    }
    return {
        name: edit.variable,
        value: updated.width * factor
    };
}
exports.updateParamWidth = updateParamWidth;
function updateParamHeight(updated, edit, layout) {
    var factor = 1;
    if (layout.units.size !== Layout_1.IUnit.pixel) {
        factor = 100;
    }
    return {
        name: edit.variable,
        value: updated.height * factor
    };
}
exports.updateParamHeight = updateParamHeight;
//# sourceMappingURL=update.js.map