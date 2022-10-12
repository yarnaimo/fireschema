import { Merge } from 'type-fest';
import { z } from 'zod';
import { DataModel, FirestoreModel } from '../index.js';
export declare const UserType: z.ZodObject<{
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
    arra: z.ZodOptional<z.ZodObject<{
        a: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        a: number;
    }, {
        a: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    options?: {
        a?: boolean | undefined;
    } | undefined;
    displayName?: string | null | undefined;
    arra?: {
        a: number;
    } | undefined;
    name: string;
    age: number;
    timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
}, {
    options?: {
        a?: boolean | undefined;
    } | undefined;
    displayName?: string | null | undefined;
    arra?: {
        a: number;
    } | undefined;
    name: string;
    age: number;
    timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
}>;
declare type User = z.infer<typeof UserType>;
declare type UserDecoded = Merge<User, {
    timestamp: Date;
}>;
export declare const firestoreModel: FirestoreModel<{
    'function isAdmin()': string;
    'function requestUserIs(uid)': string;
    collectionGroups: {
        '/posts/{postId}': {
            allow: {
                read: true;
            };
        };
    };
    '/users/{uid}': {
        model: DataModel<z.ZodObject<{
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
            arra: z.ZodOptional<z.ZodObject<{
                a: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                a: number;
            }, {
                a: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            options?: {
                a?: boolean | undefined;
            } | undefined;
            displayName?: string | null | undefined;
            arra?: {
                a: number;
            } | undefined;
            name: string;
            age: number;
            timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
        }, {
            options?: {
                a?: boolean | undefined;
            } | undefined;
            displayName?: string | null | undefined;
            arra?: {
                a: number;
            } | undefined;
            name: string;
            age: number;
            timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
        }>, (data: User) => UserDecoded, {}>;
        allow: {
            read: true;
            write: string;
        };
        '/posts/{postId}': {
            'function authorUidMatches()': string;
            model: DataModel<z.ZodObject<{
                authorUid: z.ZodString;
                text: z.ZodString;
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
            }, "strip", z.ZodTypeAny, {
                tags: {
                    name: string;
                    id: number;
                }[];
                text: string;
                authorUid: string;
            }, {
                tags: {
                    name: string;
                    id: number;
                }[];
                text: string;
                authorUid: string;
            }>, undefined, {
                byTag: (tag: string) => import("@firebase/firestore").QueryConstraint[];
            }>;
            allow: {
                read: true;
                write: string;
            };
        };
    };
}>;
export default firestoreModel;
