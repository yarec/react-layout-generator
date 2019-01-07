"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flowLayoutLayer(zIndex) {
    return zIndex;
}
exports.flowLayoutLayer = flowLayoutLayer;
function loadFromLocalStorage(prefix, key) {
    var v = localStorage.getItem(prefix + '.' + key);
    if (v) {
        return JSON.parse(v);
    }
    return undefined;
}
exports.loadFromLocalStorage = loadFromLocalStorage;
function saveToLocalStorage(prefix, key, value) {
    localStorage.setItem(prefix + '.' + key, JSON.stringify(value));
}
exports.saveToLocalStorage = saveToLocalStorage;
//# sourceMappingURL=utils.js.map