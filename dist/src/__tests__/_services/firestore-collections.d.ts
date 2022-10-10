import { FTypes, FirestoreModel, STypes, TypedFirestoreUniv } from '../../core/index.js';
import { IPostA, IPostB, IUser, IUserLocal, firestoreModel } from '../_fixtures/firestore-schema.js';
export declare type S = typeof firestoreModel.schemaOptions;
export declare type F = FTypes.FirestoreApp;
export declare type Env = 'web' | 'admin';
export declare const firestoreModelWithDup: FirestoreModel<{
    '/posts/{_post}': {
        'function test()': string;
        model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
            type: import("zod").ZodLiteral<"a">;
            text: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            type: "a";
            text: string;
        }, {
            type: "a";
            text: string;
        }>, import("zod").ZodObject<{
            type: import("zod").ZodLiteral<"b">;
            texts: import("zod").ZodArray<import("zod").ZodString, "many">;
        }, "strip", import("zod").ZodTypeAny, {
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
        model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
        allow: {};
        '/users/{uid}': {
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                name: import("zod").ZodString;
                displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                age: import("zod").ZodNumber;
                tags: import("zod").ZodArray<import("zod").ZodObject<{
                    id: import("zod").ZodNumber;
                    name: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    name: string;
                    id: number;
                }, {
                    name: string;
                    id: number;
                }>, "many">;
                timestamp: import("../../core/index.js").ZodTimestamp;
                options: import("zod").ZodOptional<import("zod").ZodObject<{
                    a: import("zod").ZodBoolean;
                    b: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    a: boolean;
                    b: string;
                }, {
                    a: boolean;
                    b: string;
                }>>;
            }, "strip", import("zod").ZodTypeAny, {
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
            }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                timestamp: string;
            }, {
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
                model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                    type: import("zod").ZodLiteral<"a">;
                    text: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    type: "a";
                    text: string;
                }, {
                    type: "a";
                    text: string;
                }>, import("zod").ZodObject<{
                    type: import("zod").ZodLiteral<"b">;
                    texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                }, "strip", import("zod").ZodTypeAny, {
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
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    type: import("zod").ZodLiteral<"a">;
                    text: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
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
export declare const _tcollections: (app: F, env: Env) => {
    typedFirestore: TypedFirestoreUniv<FirestoreModel<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }>, FTypes.FirestoreApp, {
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    typedFirestoreWithCollectionDup: TypedFirestoreUniv<FirestoreModel<{
        '/posts/{_post}': {
            'function test()': string;
            model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                type: import("zod").ZodLiteral<"a">;
                text: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                type: "a";
                text: string;
            }, {
                type: "a";
                text: string;
            }>, import("zod").ZodObject<{
                type: import("zod").ZodLiteral<"b">;
                texts: import("zod").ZodArray<import("zod").ZodString, "many">;
            }, "strip", import("zod").ZodTypeAny, {
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }>, FTypes.FirestoreApp, {
        '/posts/{_post}': {
            'function test()': string;
            model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                type: import("zod").ZodLiteral<"a">;
                text: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                type: "a";
                text: string;
            }, {
                type: "a";
                text: string;
            }>, import("zod").ZodObject<{
                type: import("zod").ZodLiteral<"b">;
                texts: import("zod").ZodArray<import("zod").ZodString, "many">;
            }, "strip", import("zod").ZodTypeAny, {
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    versions: import("../../core/index.js").TypedCollectionRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions">>;
    v1: import("../../core/index.js").TypedDocumentRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions">>;
    users: import("../../core/index.js").TypedCollectionRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users">>;
    user: import("../../core/index.js").TypedDocumentRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users">>;
    teenUsers: import("../../core/index.js").TypedQueryRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users">>;
    usersOrderedById: import("../../core/index.js").TypedQueryRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users">>;
    posts: import("../../core/index.js").TypedCollectionRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users.posts", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users.posts">>;
    post: import("../../core/index.js").TypedDocumentRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users.posts", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users.posts">>;
    usersGroup: import("../../core/index.js").TypedSelectable<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users">>;
    teenUsersGroup: import("../../core/index.js").TypedQueryRef<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users", STypes.DocDataAt<{
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
            model: import("../../core/index.js").DataModel<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, undefined, {}>;
            allow: {};
            '/users/{uid}': {
                model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    displayName: import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNull]>;
                    age: import("zod").ZodNumber;
                    tags: import("zod").ZodArray<import("zod").ZodObject<{
                        id: import("zod").ZodNumber;
                        name: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        name: string;
                        id: number;
                    }, {
                        name: string;
                        id: number;
                    }>, "many">;
                    timestamp: import("../../core/index.js").ZodTimestamp;
                    options: import("zod").ZodOptional<import("zod").ZodObject<{
                        a: import("zod").ZodBoolean;
                        b: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        a: boolean;
                        b: string;
                    }, {
                        a: boolean;
                        b: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
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
                }>, (data: IUser, snap: import("@firebase/firestore").QueryDocumentSnapshot<IUser> | FirebaseFirestore.QueryDocumentSnapshot<IUser>) => {
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
                    timestamp: string;
                }, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodUnion<[import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
                        type: "a";
                        text: string;
                    }, {
                        type: "a";
                        text: string;
                    }>, import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"b">;
                        texts: import("zod").ZodArray<import("zod").ZodString, "many">;
                    }, "strip", import("zod").ZodTypeAny, {
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
                    model: import("../../core/index.js").DataModel<import("zod").ZodObject<{
                        type: import("zod").ZodLiteral<"a">;
                        text: import("zod").ZodString;
                    }, "strip", import("zod").ZodTypeAny, {
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
    }, FTypes.FirestoreApp, "versions.users">>;
    usersRaw: import("@firebase/firestore").CollectionReference<import("@firebase/firestore").DocumentData> | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
    userData: {
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
        timestamp: import("@firebase/firestore").FieldValue | FirebaseFirestore.FieldValue;
    };
    createInitialUserAndPost: () => Promise<void>;
};
export declare type UserU = IUserLocal & STypes.DocumentMeta<F> & STypes.HasLoc<'versions.users'> & STypes.HasT<IUser> & STypes.HasId;
export declare type PostU = (IPostA | IPostB) & STypes.DocumentMeta<F> & STypes.HasLoc<'versions.users.posts'> & STypes.HasT<IPostA | IPostB> & STypes.HasId;
