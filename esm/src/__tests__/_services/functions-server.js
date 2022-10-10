import functions from 'firebase-functions';
import { expectType } from 'tsd';
import { z } from 'zod';
import { TypedFunctions } from '../../admin/index.js';
import { messages } from '../../index.js';
import { UserJsonType, firestoreModel, } from '../_fixtures/firestore-schema.js';
import { region } from './emulator.js';
const timezone = 'Asia/Tokyo';
const typedFunctions = new TypedFunctions(firestoreModel, timezone);
const builder = functions.region(region);
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
            throw new functions.https.HttpsError('internal', messages.unknown);
        }
    }
};
const createUserSchema = {
    input: UserJsonType,
    output: z.object({ result: z.number().int() }),
};
const createUserHandler = async (data, context) => {
    return wrap(data, context, async () => {
        expectType(data);
        // @ts-expect-error timestamp
        expectType(data);
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
    input: z.object({ text: z.string() }),
    output: z.object({ result: z.string() }),
};
const toUpperCaseHandler = async (data, context) => {
    return wrap(data, context, async () => {
        expectType(data);
        return { result: data.text.toUpperCase() };
    });
};
export const callable = {
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
export const http = {
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
export const topic = {
    publishMessage: typedFunctions.topic('publish_message', {
        schema: z.object({ text: z.string() }),
        builder,
        handler: async (data) => {
            expectType(data);
            console.log(data.text);
        },
    }),
};
export const schedule = {
    cron: typedFunctions.schedule({
        builder,
        schedule: '0 0 * * *',
        handler: async (context) => {
            console.log(context.timestamp);
        },
    }),
};
export const firestoreTrigger = {
    onPostCreate: typedFunctions.firestoreTrigger.onCreate({
        builder,
        path: 'versions/v1/users/{uid}/posts/{postId}',
        handler: async (decodedData, snap, context) => {
            expectType(decodedData);
            expectType(snap);
            // @ts-expect-error IUser
            expectType(decodedData);
            return { decodedData, snap };
        },
    }),
    onUserCreate: typedFunctions.firestoreTrigger.onCreate({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            expectType(decodedData);
            expectType(snap);
            // @ts-expect-error IPostA
            expectType(decodedData);
            return { decodedData, snap };
        },
    }),
    onUserDelete: typedFunctions.firestoreTrigger.onDelete({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            expectType(decodedData);
            expectType(snap);
            return { decodedData, snap };
        },
    }),
    onUserUpdate: typedFunctions.firestoreTrigger.onUpdate({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            expectType(decodedData);
            expectType(snap);
            return { decodedData, snap };
        },
    }),
    onUserWrite: typedFunctions.firestoreTrigger.onWrite({
        builder,
        path: 'versions/v1/users/{uid}',
        handler: async (decodedData, snap, context) => {
            expectType(decodedData);
            expectType(snap);
            // @ts-expect-error undefined
            expectType(decodedData);
            // @ts-expect-error QueryDocumentSnapshot
            expectType(snap);
            return { decodedData, snap };
        },
    }),
};
