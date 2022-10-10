import { z } from 'zod';
import { FirestoreModel } from '../../core/index.js';
import { DataModel, FTypes } from '../../index.js';
import { Type } from '../../lib/type.js';
export declare const UserType: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
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
    timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
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
    timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
}>;
export declare type IUser = {
    name: string;
    displayName: string | null;
    age: number;
    tags: {
        id: number;
        name: string;
    }[];
    timestamp: FTypes.Timestamp;
    options?: {
        a: boolean;
        b: string;
    } | undefined;
};
export declare type IUserLocal = Type.Merge<IUser, {
    timestamp: string;
}>;
export declare type IUserJson = Type.Merge<IUser, {
    timestamp: string;
}>;
export declare const UserJsonType: z.ZodObject<z.extendShape<{
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
}>;
export declare type IPostA = {
    type: 'a';
    text: string;
};
export declare type IPostB = {
    type: 'b';
    texts: string[];
};
export declare type IPost = IPostA | IPostB;
export declare const decodeUser: (data: IUser) => {
    timestamp: string;
    id: undefined;
    name: string;
    displayName: string | null;
    age: number;
    tags: {
        id: number;
        name: string;
    }[];
    options?: {
        a: boolean;
        b: string;
    } | undefined;
};
export declare const UserModel: DataModel<z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
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
    timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
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
    timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
}>, (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>) => IUserLocal, {
    _: () => import("@firebase/firestore").QueryConstraint[];
    teen: () => import("@firebase/firestore").QueryConstraint[];
    _teen: (random: number) => import("@firebase/firestore").QueryConstraint[];
    orderById: () => import("@firebase/firestore").QueryConstraint[];
}>;
export declare const PostModel: DataModel<z.ZodUnion<[z.ZodObject<{
    type: z.ZodLiteral<"a">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "a";
    text: string;
}, {
    type: "a";
    text: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"b">;
    texts: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: "b";
    texts: string[];
}, {
    type: "b";
    texts: string[];
}>]>, undefined, {}>;
export declare const PostAModel: DataModel<z.ZodObject<{
    type: z.ZodLiteral<"a">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "a";
    text: string;
}, {
    type: "a";
    text: string;
}>, undefined, {}>;
export declare const firestoreModel: FirestoreModel<{
    'function getCurrentAuthUserDoc()': string;
    'function isAdmin()': string;
    'function requestUserIs(uid)': string;
    collectionGroups: {
        '/users/{uid}': {
            allow: {
                read: true;
            };
        };
    };
    '/versions/{version}': {
        model: DataModel<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, undefined, {}>;
        allow: {};
        '/users/{uid}': {
            model: DataModel<z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
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
                timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
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
                timestamp: import("@firebase/firestore").Timestamp | FirebaseFirestore.Timestamp;
            }>, (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>) => IUserLocal, {
                _: () => import("@firebase/firestore").QueryConstraint[];
                teen: () => import("@firebase/firestore").QueryConstraint[];
                _teen: (random: number) => import("@firebase/firestore").QueryConstraint[];
                orderById: () => import("@firebase/firestore").QueryConstraint[];
            }>;
            allow: {
                read: true;
                write: string;
                delete: string;
            };
            '/posts/{postId}': {
                'function test()': string;
                model: DataModel<z.ZodUnion<[z.ZodObject<{
                    type: z.ZodLiteral<"a">;
                    text: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "a";
                    text: string;
                }, {
                    type: "a";
                    text: string;
                }>, z.ZodObject<{
                    type: z.ZodLiteral<"b">;
                    texts: z.ZodArray<z.ZodString, "many">;
                }, "strip", z.ZodTypeAny, {
                    type: "b";
                    texts: string[];
                }, {
                    type: "b";
                    texts: string[];
                }>]>, undefined, {}>;
                allow: {
                    read: true;
                    write: string;
                    delete: string;
                };
            };
            '/privatePosts/{postId}': {
                model: DataModel<z.ZodObject<{
                    type: z.ZodLiteral<"a">;
                    text: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "a";
                    text: string;
                }, {
                    type: "a";
                    text: string;
                }>, undefined, {}>;
                allow: {
                    read: string;
                    write: string;
                };
            };
        };
    };
}>;
export default firestoreModel;
