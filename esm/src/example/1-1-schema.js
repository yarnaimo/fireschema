import { z } from 'zod';
import { DataModel, FirestoreModel, rules, timestampType } from '../index.js';
export const UserType = z.object({
    name: z.string(),
    displayName: z.string().optional().nullable(),
    age: z.number().int(),
    timestamp: timestampType(),
    options: z.object({ a: z.boolean().optional() }).optional(),
    arra: z.record(z.string()).optional(),
});
const UserModel = new DataModel({
    schema: UserType,
    decoder: (data) => ({
        ...data,
        timestamp: data.timestamp.toDate(),
    }),
    modelName: 'UserModel',
});
const PostType = z.object({
    authorUid: z.string(),
    text: z.string(),
    tags: z.object({ id: z.number().int(), name: z.string() }).array(),
});
const PostModel = new DataModel({
    schema: PostType,
    selectors: (q) => ({
        byTag: (tag) => [
            q.where('tags', 'array-contains', tag),
            q.limit(20),
        ],
    }),
    modelName: 'PostModel',
});
export const firestoreModel = new FirestoreModel({
    'function isAdmin()': `
    return exists(${rules.basePath}/admins/$(request.auth.uid));
  `,
    'function requestUserIs(uid)': `
    return request.auth.uid == uid;
  `,
    collectionGroups: {
        '/posts/{postId}': {
            allow: {
                read: true,
            },
        },
    },
    '/users/{uid}': {
        model: UserModel,
        allow: {
            read: true,
            write: rules.or('requestUserIs(uid)', 'isAdmin()'),
        },
        '/posts/{postId}': {
            'function authorUidMatches()': `
        return request.resource.data.authorUid == uid;
      `,
            model: PostModel,
            allow: {
                read: true,
                write: rules.and('requestUserIs(uid)', 'authorUidMatches()'),
            },
        },
    },
});
export default firestoreModel;
