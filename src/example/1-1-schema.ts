import { Merge } from 'type-fest'
import {
  $,
  $allow,
  $collectionGroups,
  $functions,
  $model,
  $or,
  DataModel,
  docPath,
  FirestoreModel,
  InferSchemaType,
} from '../index.js'

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
    byTag: (tag: string) => [q.where('tags', 'array-contains', tag)],
  }),
})

export const firestoreModel = new FirestoreModel({
  [$functions]: {
    // whether /admins/<uid> exists
    'isAdmin()': `
      return exists(${docPath('admins/$(request.auth.uid)')});
    `,

    // whether uid matches
    'requestUserIs(uid)': `
      return request.auth.uid == uid;
    `,
  },

  [$collectionGroups]: {
    'posts/{postId}': {
      [$model]: PostModel,
      [$allow]: {
        read: true,
      },
    },
  },

  'users/{uid}': {
    [$model]: UserModel, // collectionSchema
    [$allow]: {
      // access control
      read: true, // all user
      write: $or(['requestUserIs(uid)', 'isAdmin()']), // only users matching {uid} or admins
    },

    'posts/{postId}': {
      [$model]: PostModel,
      [$allow]: {
        read: true,
        write: 'requestUserIs(uid)',
      },
    },
  },
})

export default firestoreModel
