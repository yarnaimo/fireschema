"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertFails = exports.getTestAppAdmin = exports.getTestAppWeb = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const app_2 = require("firebase/app");
const firestore_2 = require("firebase/firestore");
const functions_1 = require("firebase/functions");
const got_1 = require("got");
const lifts_1 = require("lifts");
const root_js_1 = require("../../core/firestore/_renderer/root.js");
const firestore_schema_js_1 = require("../_fixtures/firestore-schema.js");
const emulator_js_1 = require("./emulator.js");
const rules = (0, root_js_1.renderSchema)(firestore_schema_js_1.firestoreModel);
const firestoreEmulatorUrl = (path) => `http://${emulator_js_1.localhost}:${emulator_js_1.emulators.firestore.port}/emulator/v1/projects/${emulator_js_1.projectId}${path}`;
beforeAll(async () => {
    await got_1.default.put(firestoreEmulatorUrl(':securityRules'), {
        body: JSON.stringify({
            rules: {
                files: [{ content: rules }],
            },
        }),
    });
});
afterEach(async () => {
    await got_1.default.delete(firestoreEmulatorUrl('/databases/(default)/documents'));
});
afterAll(async () => {
    await (0, lifts_1.MapAsync)((0, app_2.getApps)(), app_2.deleteApp);
    await (0, lifts_1.MapAsync)((0, app_1.getApps)(), app_1.deleteApp);
});
const appName = () => Date.now() + '_' + Math.random();
const getTestAppWeb = (uid) => {
    const app = (0, app_2.initializeApp)({ projectId: emulator_js_1.projectId }, appName());
    const firestore = (0, firestore_2.getFirestore)(app);
    (0, firestore_2.connectFirestoreEmulator)(firestore, emulator_js_1.localhost, emulator_js_1.emulators.firestore.port, {
        mockUserToken: { user_id: uid },
    });
    return {
        firestore: () => firestore,
        functions: (region) => (0, functions_1.getFunctions)(app, region),
    };
};
exports.getTestAppWeb = getTestAppWeb;
const getTestAppAdmin = () => {
    const app = (0, app_1.initializeApp)({ projectId: emulator_js_1.projectId }, appName());
    const firestore = (0, firestore_1.getFirestore)(app);
    firestore.settings({
        host: `${emulator_js_1.localhost}:${emulator_js_1.emulators.firestore.port}`,
        ssl: false,
    });
    return {
        firestore: () => firestore,
    };
};
exports.getTestAppAdmin = getTestAppAdmin;
const assertFails = async (pr) => {
    const _warn = console.warn;
    const consoleMock = jest
        .spyOn(console, 'warn')
        .mockImplementation((...args) => {
        if (args.some((m) => typeof m === 'string' && m.startsWith('7 PERMISSION_DENIED'))) {
            return;
        }
        _warn(...args);
    });
    const result = await pr().then(async () => {
        return Promise.reject(new Error('Expected request to fail, but it succeeded.'));
    }, (err) => {
        const isPermissionDenied = err.code === 'permission-denied';
        if (!isPermissionDenied) {
            return Promise.reject(new Error('Expected PERMISSION_DENIED but got unexpected error: ' + err));
        }
        return err;
    });
    consoleMock.mockRestore();
    return result;
};
exports.assertFails = assertFails;
