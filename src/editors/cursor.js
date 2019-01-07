"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
function cursor(edit) {
    var c = 'move';
    switch (edit.ref) {
        case Layout_1.PositionRef.none: {
            break;
        }
        case Layout_1.PositionRef.position: {
            c = 'move';
            break;
        }
        case Layout_1.PositionRef.left: {
            c = 'w-resize';
            break;
        }
        case Layout_1.PositionRef.right: {
            c = 'w-resize';
            break;
        }
        case Layout_1.PositionRef.top: {
            c = 'n-resize';
            break;
        }
        case Layout_1.PositionRef.bottom: {
            c = 'n-resize';
            break;
        }
        case Layout_1.PositionRef.leftTop: {
            c = 'nw-resize';
            break;
        }
        case Layout_1.PositionRef.rightTop: {
            c = 'ne-resize';
            break;
        }
        case Layout_1.PositionRef.leftBottom: {
            c = 'nw-resize';
            break;
        }
        case Layout_1.PositionRef.rightBottom: {
            c = 'ne-resize';
            break;
        }
        default: {
            console.error("Invalid PositionRef in cursor " + edit.ref);
            break;
        }
    }
    return c;
}
exports.cursor = cursor;
//# sourceMappingURL=cursor.js.map