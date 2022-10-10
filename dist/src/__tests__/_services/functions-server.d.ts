import * as functions from 'firebase-functions';
import { z } from 'zod';
import { FunTypes } from '../../index.js';
import { _admin } from '../../lib/firestore-types.js';
export declare const callable: {
    createUser: functions.HttpsFunction & functions.Runnable<any> & FunTypes.Callable.Meta<z.ZodObject<z.extendShape<{
        name: z.ZodString;
        displayName: z.ZodUnion<[z.ZodString, z.ZodNull]>;
        age: z.ZodNumber;
        tags: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: number;
        }, {
            name: string;
            id: number;
        }>, "many">;
        timestamp: import("../../index.js").ZodTimestamp;
        options: z.ZodOptional<z.ZodObject<{
            a: z.ZodBoolean;
            b: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            a: boolean;
            b: string;
        }, {
            a: boolean;
            b: string;
        }>>;
    }, {
        timestamp: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        options?: {
            a: boolean;
            b: string;
        } | undefined;
        name: string;
        displayName: string | null;
        age: number;
        tags: {
            name: string;
            id: number;
        }[];
        timestamp: string;
    }, {
        options?: {
            a: boolean;
            b: string;
        } | undefined;
        name: string;
        displayName: string | null;
        age: number;
        tags: {
            name: string;
            id: number;
        }[];
        timestamp: string;
    }>, z.ZodObject<{
        result: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        result: number;
    }, {
        result: number;
    }>>;
    nested: {
        toUpperCase: functions.HttpsFunction & functions.Runnable<any> & FunTypes.Callable.Meta<z.ZodObject<{
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            text: string;
        }, {
            text: string;
        }>, z.ZodObject<{
            result: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            result: string;
        }, {
            result: string;
        }>>;
    };
};
export declare const http: {
    getKeys: functions.HttpsFunction;
};
export declare const topic: {
    publishMessage: functions.CloudFunction<functions.pubsub.Message> & FunTypes.Topic.Meta<"publish_message", z.ZodObject<{
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
    }, {
        text: string;
    }>>;
};
export declare const schedule: {
    cron: functions.CloudFunction<unknown>;
};
export declare const firestoreTrigger: {
    onPostCreate: functions.CloudFunction<_admin.QueryDocumentSnapshot<_admin.DocumentData>>;
    onUserCreate: functions.CloudFunction<_admin.QueryDocumentSnapshot<_admin.DocumentData>>;
    onUserDelete: functions.CloudFunction<_admin.QueryDocumentSnapshot<_admin.DocumentData>>;
    onUserUpdate: functions.CloudFunction<functions.Change<_admin.QueryDocumentSnapshot<_admin.DocumentData>>>;
    onUserWrite: functions.CloudFunction<functions.Change<_admin.DocumentSnapshot<_admin.DocumentData>>>;
};
