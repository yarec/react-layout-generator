"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
function getExtendElement(edit) {
    var extendElement = function (r, deltaX, deltaY) {
        return { x: r.x + deltaX, y: r.y + deltaY, width: r.width, height: r.height };
    };
    switch (edit.ref) {
        case Layout_1.PositionRef.none: {
            break;
        }
        case Layout_1.PositionRef.position: {
            break;
        }
        case Layout_1.PositionRef.left: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x + deltaX, y: r.y, width: r.width - deltaX, height: r.height };
            };
            break;
        }
        case Layout_1.PositionRef.right: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x, y: r.y, width: r.width + deltaX, height: r.height };
            };
            break;
        }
        case Layout_1.PositionRef.top: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x, y: r.y + deltaY, width: r.width, height: r.height - deltaY };
            };
            break;
        }
        case Layout_1.PositionRef.bottom: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x, y: r.y, width: r.width, height: r.height + deltaY };
            };
            break;
        }
        case Layout_1.PositionRef.leftTop: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x - deltaX, y: r.y - deltaY, width: r.width + deltaX, height: r.height + deltaY };
            };
            break;
        }
        case Layout_1.PositionRef.rightTop: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x, y: r.y - deltaY, width: r.width + deltaX, height: r.height + deltaY };
            };
            break;
        }
        case Layout_1.PositionRef.leftBottom: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x - deltaX, y: r.y, width: r.width + deltaX, height: r.height + deltaY };
            };
            break;
        }
        case Layout_1.PositionRef.rightBottom: {
            extendElement = function (r, deltaX, deltaY) {
                return { x: r.x, y: r.y - deltaY, width: r.width + deltaX, height: r.height + deltaY };
            };
            break;
        }
        default: {
            console.error("Invalid PositionRef in ExtendElement " + edit.ref);
            break;
        }
    }
    return extendElement;
}
exports.default = getExtendElement;
//# sourceMappingURL=extendElement.js.map