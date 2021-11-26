import { TypedFirestoreAdmin } from '../../core/firestore/controller/_TypedFirestoreAdmin.js'
import {
  collectionUniv,
  docUniv,
  setDocUniv,
} from '../../core/firestore/controller/_universal.js'
import {
  FTypes,
  FirestoreModel,
  STypes,
  TypedFirestoreUniv,
  TypedFirestoreWeb,
  _createdAt,
  _updatedAt,
} from '../../core/index.js'
import { createUserData, postAData } from '../_fixtures/data.js'
import {
  IPostA,
  IPostB,
  IUser,
  IUserLocal,
  firestoreModel,
} from '../_fixtures/firestore-schema.js'

export type S = typeof firestoreModel.schemaOptions
export type F = FTypes.FirestoreApp

export type Env = 'web' | 'admin'

export const firestoreModelWithDup = new FirestoreModel({
  ...firestoreModel.schemaOptions,
  '/posts/{_post}':
    firestoreModel.schemaOptions['/versions/{version}']['/users/{uid}'][
      '/posts/{postId}'
    ],
})

export const _tcollections = (app: F, env: Env) => {
  const typedFirestore = (
    env === 'web'
      ? new TypedFirestoreWeb(firestoreModel, app as any)
      : new TypedFirestoreAdmin(firestoreModel, app as any)
  ) as TypedFirestoreUniv<typeof firestoreModel, F>

  const typedFirestoreWithCollectionDup = (
    env === 'web'
      ? new TypedFirestoreWeb(firestoreModelWithDup, app as any)
      : new TypedFirestoreAdmin(firestoreModelWithDup, app as any)
  ) as TypedFirestoreUniv<typeof firestoreModelWithDup, F>

  void (() => {
    typedFirestore.collection(
      // @ts-expect-error: wrong collection name
      'users',
    )
  })
  const versions = typedFirestore.collection('versions')
  const v1 = versions.doc('v1')

  void (() => {
    v1.collection(
      // @ts-expect-error: wrong collection name
      'posts',
    )
  })
  const users = v1.collection('users')
  const teenUsers = v1.collection('users').select.teen()
  const usersOrderedById = users.select.orderById()
  const user = users.doc('user')

  const posts = user.collection('posts')
  const post = posts.doc('post')

  const usersGroup = typedFirestore.collectionGroup('users')
  const teenUsersGroup = usersGroup.select.teen()

  const usersRaw = collectionUniv(
    docUniv(collectionUniv(app, 'versions'), 'v1'),
    'users',
  )

  const userData = createUserData(typedFirestore.firestoreStatic)

  const createInitialUserAndPost = async () => {
    const meta = {
      [_createdAt]: typedFirestore.firestoreStatic.serverTimestamp(),
      [_updatedAt]: typedFirestore.firestoreStatic.serverTimestamp(),
    }

    const userRef = docUniv(usersRaw, 'user')
    await setDocUniv(userRef, { ...userData, ...meta } as any)

    const postRef = docUniv(collectionUniv(userRef, 'posts'), 'post')
    await setDocUniv(postRef, { ...postAData, ...meta } as any)
  }

  return {
    typedFirestore,
    typedFirestoreWithCollectionDup,
    versions,
    v1,
    users,
    user,
    teenUsers,
    usersOrderedById,
    posts,
    post,
    usersGroup,
    teenUsersGroup,
    usersRaw,
    userData,
    createInitialUserAndPost,
  }
}

export type UserU = IUserLocal &
  STypes.DocumentMeta<F> &
  STypes.HasLoc<'versions.users'> &
  STypes.HasT<IUser> &
  STypes.HasId

export type PostU = (IPostA | IPostB) &
  STypes.DocumentMeta<F> &
  STypes.HasLoc<'versions.users.posts'> &
  STypes.HasT<IPostA | IPostB> &
  STypes.HasId
