"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
function getUpdateHandle(edit) {
    var handle = function (r) {
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    switch (edit.ref) {
        case Layout_1.PositionRef.position: {
            // use default
            break;
        }
        case Layout_1.PositionRef.left: {
            handle = function (r) {
                return { x: r.x - 2, y: r.y, width: 4, height: r.height };
            };
            break;
        }
        case Layout_1.PositionRef.right: {
            handle = function (r) {
                return { x: r.x + r.width - 2, y: r.y, width: 4, height: r.height };
            };
            break;
        }
        case Layout_1.PositionRef.top: {
            handle = function (r) {
                return { x: r.x, y: r.y - 2, width: r.width, height: 4 };
            };
            break;
        }
        case Layout_1.PositionRef.bottom: {
            handle = function (r) {
                return { x: r.x, y: r.y + r.height - 2, width: r.width, height: 4 };
            };
            break;
        }
        case Layout_1.PositionRef.leftTop: {
            handle = function (r) {
                return { x: r.x - 2, y: r.y - 2, width: 4, height: 4 };
            };
            break;
        }
        case Layout_1.PositionRef.rightTop: {
            handle = function (r) {
                return { x: r.x + r.width - 2, y: r.y - 2, width: 4, height: 4 };
            };
            break;
        }
        case Layout_1.PositionRef.leftBottom: {
            handle = function (r) {
                return { x: r.x - 2, y: r.y + r.height - 2, width: 4, height: 4 };
            };
            break;
        }
        case Layout_1.PositionRef.rightBottom: {
            handle = function (r) {
                return { x: r.x + r.width - 2, y: r.y + r.height - 2, width: 4, height: 4 };
            };
            break;
        }
        default: {
            console.error("Invalid PositionRef in UpdateHandle " + edit.ref);
            break;
        }
    }
    return handle;
}
exports.default = getUpdateHandle;
//# sourceMappingURL=updateHandle.js.map