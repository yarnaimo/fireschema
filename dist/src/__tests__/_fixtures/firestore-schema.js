"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestoreModel = exports.PostAModel = exports.PostModel = exports.UserModel = exports.decodeUser = exports.UserJsonType = exports.UserType = void 0;
const tsd_1 = require("tsd");
const zod_1 = require("zod");
const index_js_1 = require("../../core/index.js");
const index_js_2 = require("../../index.js");
const VersionType = zod_1.z.object({});
exports.UserType = zod_1.z.object({
    name: zod_1.z.string(),
    displayName: zod_1.z.union([zod_1.z.string(), zod_1.z.null()]),
    age: zod_1.z.number().int(),
    tags: zod_1.z.object({ id: zod_1.z.number().int(), name: zod_1.z.string() }).array(),
    timestamp: (0, index_js_1.timestampType)(),
    options: zod_1.z.object({ a: zod_1.z.boolean(), b: zod_1.z.string() }).optional(),
});
(0, tsd_1.expectType)({});
exports.UserJsonType = exports.UserType.extend({ timestamp: zod_1.z.string() });
const PostAType = zod_1.z.object({
    type: zod_1.z.literal('a'),
    text: zod_1.z.string(),
});
const PostBType = zod_1.z.object({
    type: zod_1.z.literal('b'),
    texts: zod_1.z.string().array(),
});
const PostType = zod_1.z.union([PostAType, PostBType]);
(0, tsd_1.expectType)({});
const VersionModel = new index_js_2.DataModel({ schema: VersionType });
// void (() => {
//   const VersionSchemaError = $collectionSchema<IVersion>()({
//     // @ts-expect-error decoder without U type
//     decoder: (data) => data,
//   })
// })
const decodeUser = (data) => ({
    ...data,
    timestamp: data.timestamp.toDate().toISOString(),
    id: undefined, // decode -> id追加 の順に行われるのを確認する用
});
exports.decodeUser = decodeUser;
exports.UserModel = new index_js_2.DataModel({
    schema: exports.UserType,
    decoder: (data, snap) => (0, exports.decodeUser)(data),
    selectors: (q, firestoreStatic) => ({
        _: () => [
            // @ts-expect-error wrong field path
            q.where('age_', '>=', 10),
        ],
        teen: () => [q.where('age', '>=', 10), q.where('age', '<', 20)],
        _teen: (random) => [
            q.where('age', '>=', 10),
            q.where('age', '<', 20 + random),
        ],
        orderById: () => [q.orderBy(firestoreStatic.documentId())],
    }),
});
// void (() => {
//   const UserSchemaError = $collectionSchema<IUser, IUserLocal>()({
//     // @ts-expect-error decoder not specified
//     decoder: undefined,
//   })
// })
exports.PostModel = new index_js_2.DataModel({ schema: PostType });
exports.PostAModel = new index_js_2.DataModel({ schema: PostAType });
exports.firestoreModel = new index_js_1.FirestoreModel({
    'function getCurrentAuthUserDoc()': `
    return get(${index_js_1.rules.basePath}/authUsers/$(request.auth.uid));
  `,
    'function isAdmin()': `
    return getCurrentAuthUserDoc().data.isAdmin == true;
  `,
    'function requestUserIs(uid)': `
    return request.auth.uid == uid;
  `,
    collectionGroups: {
        '/users/{uid}': {
            allow: {
                read: true,
            },
        },
    },
    '/versions/{version}': {
        model: VersionModel,
        allow: {},
        '/users/{uid}': {
            model: exports.UserModel,
            allow: {
                read: true,
                write: index_js_1.rules.or('requestUserIs(uid)'),
                delete: 'requestUserIs(uid)',
            },
            '/posts/{postId}': {
                'function test()': `
          return true;
        `,
                model: exports.PostModel,
                allow: {
                    read: true,
                    write: index_js_1.rules.or('requestUserIs(uid)'),
                    delete: 'requestUserIs(uid)',
                },
            },
            '/privatePosts/{postId}': {
                model: exports.PostAModel,
                allow: {
                    read: index_js_1.rules.or('isAdmin()', 'requestUserIs(uid)'),
                    write: index_js_1.rules.or('requestUserIs(uid)'),
                },
            },
        },
    },
});
exports.default = exports.firestoreModel;
