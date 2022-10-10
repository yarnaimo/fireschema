"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAData = exports.userDataJson = exports.createUserData = exports.userDataBase = void 0;
const _static_js_1 = require("../../core/firestore/controller/_static.js");
exports.userDataBase = {
    name: 'name1',
    displayName: null,
    age: 16,
    tags: [
        { id: 0, name: 'tag0' },
        { id: 1, name: 'tag1' },
    ],
    options: { a: true, b: 'value' },
};
const createUserData = ({ serverTimestamp, }) => ({
    ...exports.userDataBase,
    timestamp: serverTimestamp(),
});
exports.createUserData = createUserData;
exports.userDataJson = {
    ...(0, exports.createUserData)(_static_js_1.firestoreStaticWeb),
    timestamp: new Date().toISOString(),
};
exports.postAData = { type: 'a', text: 'value' };
