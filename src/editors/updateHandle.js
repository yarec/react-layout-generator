"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = require("../components/Layout");
var handleWidth = 6;
var halfHandleWidth = 3;
function getUpdateHandle(edit) {
    var handle = function (r) {
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    switch (edit.ref) {
        case Layout_1.PositionRef.none: {
            break;
        }
        case Layout_1.PositionRef.position: {
            break;
        }
        case Layout_1.PositionRef.left: {
            handle = function (r) {
                return { x: r.x - halfHandleWidth, y: r.y, width: handleWidth, height: r.height };
            };
            break;
        }
        case Layout_1.PositionRef.right: {
            handle = function (r) {
                return { x: r.x + r.width - halfHandleWidth, y: r.y, width: handleWidth, height: r.height };
            };
            break;
        }
        case Layout_1.PositionRef.top: {
            handle = function (r) {
                return { x: r.x, y: r.y - halfHandleWidth, width: r.width, height: handleWidth };
            };
            break;
        }
        case Layout_1.PositionRef.bottom: {
            handle = function (r) {
                return { x: r.x, y: r.y + r.height - halfHandleWidth, width: r.width, height: handleWidth };
            };
            break;
        }
        case Layout_1.PositionRef.leftTop: {
            handle = function (r) {
                return { x: r.x - halfHandleWidth, y: r.y - halfHandleWidth, width: handleWidth, height: handleWidth };
            };
            break;
        }
        case Layout_1.PositionRef.rightTop: {
            handle = function (r) {
                return { x: r.x + r.width - halfHandleWidth, y: r.y - halfHandleWidth, width: handleWidth, height: handleWidth };
            };
            break;
        }
        case Layout_1.PositionRef.leftBottom: {
            handle = function (r) {
                return { x: r.x - halfHandleWidth, y: r.y + r.height - halfHandleWidth, width: handleWidth, height: handleWidth };
            };
            break;
        }
        case Layout_1.PositionRef.rightBottom: {
            handle = function (r) {
                return { x: r.x + r.width - halfHandleWidth, y: r.y + r.height - halfHandleWidth, width: handleWidth, height: handleWidth };
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