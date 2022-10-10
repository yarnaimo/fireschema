"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedTopic = exports.typedCaller = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const functions_1 = require("firebase/functions");
const index_js_1 = require("../../index.js");
const app_js_1 = require("./app.js");
const emulator_js_1 = require("./emulator.js");
const functionsApp = (0, app_js_1.getTestAppWeb)('user').functions('asia-northeast1');
(0, functions_1.connectFunctionsEmulator)(functionsApp, emulator_js_1.localhost, emulator_js_1.emulators.functions.port);
exports.typedCaller = new index_js_1.TypedCaller(functionsApp);
exports.typedTopic = new index_js_1.TypedTopic(new pubsub_1.PubSub({
    apiEndpoint: `http://${emulator_js_1.localhost}:${emulator_js_1.emulators.pubsub.port}`,
    projectId: emulator_js_1.projectId,
}));
