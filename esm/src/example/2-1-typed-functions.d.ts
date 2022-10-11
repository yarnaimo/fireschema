import * as functions from 'firebase-functions';
import { z } from 'zod';
/**
 * functions/index.ts file
 */
export declare const UserJsonType: z.ZodObject<z.extendShape<{
    name: z.ZodString;
    displayName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    age: z.ZodNumber;
    timestamp: import("../index.js").ZodTimestamp;
    options: z.ZodOptional<z.ZodObject<{
        a: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        a?: boolean | undefined;
    }, {
        a?: boolean | undefined;
    }>>;
    arra: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    timestamp: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    options?: {
        a?: boolean | undefined;
    } | undefined;
    displayName?: string | null | undefined;
    arra?: string[] | undefined;
    name: string;
    age: number;
    timestamp: string;
}, {
    options?: {
        a?: boolean | undefined;
    } | undefined;
    displayName?: string | null | undefined;
    arra?: string[] | undefined;
    name: string;
    age: number;
    timestamp: string;
}>;
export declare const callable: {
    createUser: functions.HttpsFunction & functions.Runnable<any> & import("../index.js").FunTypes.Callable.Meta<z.ZodObject<z.extendShape<{
        name: z.ZodString;
        displayName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        age: z.ZodNumber;
        timestamp: import("../index.js").ZodTimestamp;
        options: z.ZodOptional<z.ZodObject<{
            a: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            a?: boolean | undefined;
        }, {
            a?: boolean | undefined;
        }>>;
        arra: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        timestamp: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        options?: {
            a?: boolean | undefined;
        } | undefined;
        displayName?: string | null | undefined;
        arra?: string[] | undefined;
        name: string;
        age: number;
        timestamp: string;
    }, {
        options?: {
            a?: boolean | undefined;
        } | undefined;
        displayName?: string | null | undefined;
        arra?: string[] | undefined;
        name: string;
        age: number;
        timestamp: string;
    }>, z.ZodObject<{
        result: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        result: boolean;
    }, {
        result: boolean;
    }>>;
};
export declare const firestoreTrigger: {
    onUserCreate: functions.CloudFunction<FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>>;
};
export declare const http: {
    getKeys: functions.HttpsFunction;
};
export declare const topic: {
    publishMessage: functions.CloudFunction<functions.pubsub.Message> & import("../index.js").FunTypes.Topic.Meta<"publish_message", z.ZodObject<{
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
