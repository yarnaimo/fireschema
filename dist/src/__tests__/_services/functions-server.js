"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestoreTrigger = exports.schedule = exports.topic = exports.http = exports.callable = void 0;
const functions = require("firebase-functions");
const tsd_1 = require("tsd");
const zod_1 = require("zod");
const index_js_1 = require("../../admin/index.js");
const index_js_2 = require("../../index.js");
const firestore_schema_js_1 = require("../_fixtures/firestore-schema.js");
const emulator_js_1 = require("./emulator.js");
const timezone = 'Asia/Tokyo';
const typedFunctions = new index_js_1.TypedFunctions(firestore_schema_js_1.firestoreModel, timezone);
const builder = functions.region(emulator_js_1.region);
const wrap = async (data, context, fn) => {
    try {
        const output = await fn(data, context);
        return output;
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        else {
            throw new functions.https.HttpsError('internal', index_js_2.messages.unknown);
        }
    }
};
const createUserSchema = {
    input: firestore_schema_js_1.UserJsonType,
    output: zod_1.z.object({ result: zod_1.z.number().int() }),
};
const createUserHandler = async (data, context) => {
    return wrap(data, context, async () => {
        (0, tsd_1.expectType)(data);
        // @ts-expect-error timestamp
        (0, tsd_1.expectType)(data);
        if (data.age < 0) {
            throw new functions.https.HttpsError('out-of-range', 'out of range');
        }
        else if (100 <= data.age) {
            throw new Error();
        }
        return { result: data.age ** 2 };
    });
};
const toUpperCaseSchema = {
    input: zod_1.z.object({ text: zod_1.z.string() }),
    output: zod_1.z.object({ result: zod_1.z.string() }),
};
const toUpperCaseHandler = async (data, context) => {
    return wrap(data, context, async () => {
        (0, tsd_1.expectType)(data);
        return { result: data.text.toUpperCase() };
    });
};
exports.callable = {
    createUser: typedFunctions.callable({
        schema: createUserSchema,
        builder,
        handler: createUserHandler,
    }),
    nested: {
        toUpperCase: typedFunctions.callable({
            schema: toUpperCaseSchema,
            builder,
            handler: toUpperCaseHandler,
        }),
    },
};
!(() => {
    typedFunctions.callable({
        schema: createUserSchema,
        builder,
        handler: async (data, context) => 
        // @ts-expect-error: result type
        ({ result: null }),
    });
    typedFunctions.callable({
        schema: toUpperCaseSchema,
        builder,
        handler: async (data, context) => 
        // @ts-expect-error: result type
        ({ result: null }),
    });
});
exports.http = {
    getKeys: typedFunctions.http({
        builder,
        handler: (req, resp) => {
            if (req.method !== 'POST') {
                resp.status(400).send();
                return;
            }
            resp.json(Object.keys(req.body));
        },
    }),
};
exports.topic = {
    publishMessage: typedFunctions.topic('publish_message', {
        schema: zod_1.z.object({ text: zod_1.z.string() }),
        builder,
        handler: async (data) => {
            (0, tsd_1.expectType)(data);
            console.log(data.text);
        },
    }),
};
exports.schedule = {
    cron: typedFunctions.schedule({
        builder,
        schedule: '0 0 * * *',
        handler: async (context) => {
            console.log(context.timestamp);
        },
    }),
};
exports.firestoreTrigger = {
    onPostCreate: typedFunctions.firestoreTrigger.onCreate({
        builder,
        path: 'versions/v1/users/{uid}/posts/{postId}',
        handler: async (decodedData, snap, context) => {
            (0, tsd_1.expectType)(decodedData);
            (0, tsd_1.expectType)(snap);
            // @ts-expect-error IUser
            (0, tsd_1.expectType)(decodedData);
            return { decodedData, snap };
        },
    }),
    onUserCreate: typedFunctions.firestoreTrigger.onCreate({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            (0, tsd_1.expectType)(decodedData);
            (0, tsd_1.expectType)(snap);
            // @ts-expect-error IPostA
            (0, tsd_1.expectType)(decodedData);
            return { decodedData, snap };
        },
    }),
    onUserDelete: typedFunctions.firestoreTrigger.onDelete({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            (0, tsd_1.expectType)(decodedData);
            (0, tsd_1.expectType)(snap);
            return { decodedData, snap };
        },
    }),
    onUserUpdate: typedFunctions.firestoreTrigger.onUpdate({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            (0, tsd_1.expectType)(decodedData);
            (0, tsd_1.expectType)(snap);
            return { decodedData, snap };
        },
    }),
    onUserWrite: typedFunctions.firestoreTrigger.onWrite({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            (0, tsd_1.expectType)(decodedData);
            (0, tsd_1.expectType)(snap);
            // @ts-expect-error undefined
            (0, tsd_1.expectType)(decodedData);
            // @ts-expect-error QueryDocumentSnapshot
            (0, tsd_1.expectType)(snap);
            return { decodedData, snap };
        },
    }),
};
