import { Merge } from 'type-fest'
import {
  $,
  $allow,
  $collectionGroups,
  $docLabel,
  $functions,
  $model,
  $or,
  DataModel,
  FirestoreModel,
  InferSchemaType,
} from '..'

// user
export const UserType = {
  name: $.string,
  displayName: $.union($.string, $.null),
  age: $.int,
  timestamp: $.timestamp,
  options: $.optional({ a: $.bool }),
}
type User = InferSchemaType<typeof UserType>
/* => {
  name: string
  displayName: string | null
  age: number
  timestamp: FTypes.Timestamp
  options: { a: boolean } | undefined
} */

type UserDecoded = Merge<User, { timestamp: Date }>

const UserModel = new DataModel({
  schema: UserType,
  decoder: (data: User): UserDecoded => ({
    ...data,
    timestamp: data.timestamp.toDate(),
  }),
})

// post
const PostType = {
  tags: $.array({ id: $.int, name: $.string }),
  text: $.string,
}

const PostModel = new DataModel({
  schema: PostType,
  selectors: (q) => ({
    byTag: (tag: string) => q.where('tags', 'array-contains', tag),
  }),
})

export const firestoreModel = new FirestoreModel({
  [$functions]: {
    // whether /admins/<uid> exists
    ['isAdmin()']: `
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    `,

    // whether uid matches
    ['matchesUser(uid)']: `
      return request.auth.uid == uid;
    `,
  },

  [$collectionGroups]: {
    posts: {
      [$docLabel]: 'postId',
      [$model]: PostModel,
      [$allow]: {
        read: true,
      },
    },
  },

  // /users/{uid}
  users: {
    [$docLabel]: 'uid', // {uid}
    [$model]: UserModel, // collectionSchema
    [$allow]: {
      // access control
      read: true, // all user
      write: $or(['matchesUser(uid)', 'isAdmin()']), // only users matching {uid} or admins
    },

    // /users/{uid}/posts/{postId}
    posts: {
      [$docLabel]: 'postId',
      [$model]: PostModel,
      [$allow]: {
        read: true,
        write: 'matchesUser(uid)',
      },
    },
  },
})

export default firestoreModel
