"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapSuspendable = void 0;
const wrapSuspendable = (fn) => {
    let result;
    try {
        result = fn();
    }
    catch (error) {
        if (error instanceof Promise) {
            result = null;
        }
        else {
            throw error;
        }
    }
    return result;
};
exports.wrapSuspendable = wrapSuspendable;
