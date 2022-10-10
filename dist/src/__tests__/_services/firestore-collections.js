'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports._tcollections = exports.firestoreModelWithDup = void 0
const _TypedFirestoreAdmin_js_1 = require('../../core/firestore/controller/_TypedFirestoreAdmin.js')
const _universal_js_1 = require('../../core/firestore/controller/_universal.js')
const index_js_1 = require('../../core/index.js')
const data_js_1 = require('../_fixtures/data.js')
const firestore_schema_js_1 = require('../_fixtures/firestore-schema.js')
exports.firestoreModelWithDup = new index_js_1.FirestoreModel({
  ...firestore_schema_js_1.firestoreModel.schemaOptions,
  '/posts/{_post}':
    firestore_schema_js_1.firestoreModel.schemaOptions['/versions/{version}'][
      '/users/{uid}'
    ]['/posts/{postId}'],
})
const _tcollections = (app, env) => {
  const typedFirestore =
    env === 'web'
      ? new index_js_1.TypedFirestoreWeb(
          firestore_schema_js_1.firestoreModel,
          app,
        )
      : new _TypedFirestoreAdmin_js_1.TypedFirestoreAdmin(
          firestore_schema_js_1.firestoreModel,
          app,
        )
  const typedFirestoreWithCollectionDup =
    env === 'web'
      ? new index_js_1.TypedFirestoreWeb(exports.firestoreModelWithDup, app)
      : new _TypedFirestoreAdmin_js_1.TypedFirestoreAdmin(
          exports.firestoreModelWithDup,
          app,
        )
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
  const usersRaw = (0, _universal_js_1.collectionUniv)(
    (0, _universal_js_1.docUniv)(
      (0, _universal_js_1.collectionUniv)(app, 'versions'),
      'v1',
    ),
    'users',
  )
  const userData = (0, data_js_1.createUserData)(typedFirestore.firestoreStatic)
  const createInitialUserAndPost = async () => {
    const meta = {
      [index_js_1._createdAt]: typedFirestore.firestoreStatic.serverTimestamp(),
      [index_js_1._updatedAt]: typedFirestore.firestoreStatic.serverTimestamp(),
    }
    const userRef = (0, _universal_js_1.docUniv)(usersRaw, 'user')
    await (0, _universal_js_1.setDocUniv)(userRef, { ...userData, ...meta })
    const postRef = (0, _universal_js_1.docUniv)(
      (0, _universal_js_1.collectionUniv)(userRef, 'posts'),
      'post',
    )
    await (0, _universal_js_1.setDocUniv)(postRef, {
      ...data_js_1.postAData,
      ...meta,
    })
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
exports._tcollections = _tcollections
