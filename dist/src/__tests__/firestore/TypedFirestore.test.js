'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const react_hooks_1 = require('@testing-library/react-hooks')
const type_extends_1 = require('@yarnaimo/type-extends')
const tsd_1 = require('tsd')
const _universal_js_1 = require('../../core/firestore/controller/_universal.js')
const index_js_1 = require('../../core/index.js')
const _object_js_1 = require('../../core/utils/_object.js')
const useTypedCollection_js_1 = require('../../hooks/useTypedCollection.js')
const useTypedDocument_js_1 = require('../../hooks/useTypedDocument.js')
const fp_js_1 = require('../../lib/fp.js')
const data_js_1 = require('../_fixtures/data.js')
const firestore_schema_js_1 = require('../_fixtures/firestore-schema.js')
const app_js_1 = require('../_services/app.js')
const firestore_collections_js_1 = require('../_services/firestore-collections.js')
const common_js_1 = require('../_utils/common.js')
const firestore_js_1 = require('../_utils/firestore.js')
describe('types', () => {
  test('decoder', () => {
    ;(0, tsd_1.expectType)(firestore_schema_js_1.UserModel.decoder)
    ;(0, tsd_1.expectType)(firestore_schema_js_1.PostModel.decoder)
  })
  test('UAt', () => {
    ;(0, tsd_1.expectType)({})
    ;(0, tsd_1.expectType)(
      // @ts-expect-error: wrong U type
      {},
    )
  })
  test('CollectionNameToLoc', () => {
    ;(0, tsd_1.expectType)({})
    ;(0, tsd_1.expectType)({})
  })
})
describe('utils', () => {
  test('getCollectionOptionsByName', () => {
    expect(
      (0, _object_js_1.getCollectionOptionsByName)(
        firestore_schema_js_1.firestoreModel.schemaOptions,
        'posts',
      ),
    ).toEqual([
      {
        loc: 'versions.users.posts',
        options: expect.objectContaining({
          model: firestore_schema_js_1.PostModel,
        }),
      },
    ])
    expect(
      (0, _object_js_1.getCollectionOptionsByName)(
        firestore_collections_js_1.firestoreModelWithDup.schemaOptions,
        'posts',
      ),
    ).toEqual([
      {
        loc: 'versions.users.posts',
        options: expect.objectContaining({
          model: firestore_schema_js_1.PostModel,
        }),
      },
      {
        loc: 'posts',
        options: expect.objectContaining({
          model: firestore_schema_js_1.PostModel,
        }),
      },
    ])
  })
})
for (const env of ['web', 'admin']) {
  const $env = (str) => `[${env}] ${str}`
  const app =
    env === 'web'
      ? (0, app_js_1.getTestAppWeb)('user').firestore()
      : (0, app_js_1.getTestAppAdmin)().firestore()
  const appUnauthed =
    env === 'web'
      ? (0, app_js_1.getTestAppWeb)('unauthed').firestore()
      : (0, app_js_1.getTestAppAdmin)().firestore()
  const r = (0, firestore_collections_js_1._tcollections)(app, env)
  const ur = (0, firestore_collections_js_1._tcollections)(appUnauthed, env)
  const firestoreStatic = r.typedFirestore.firestoreStatic
  const expectAnyTimestamp =
    env === 'web'
      ? firestore_js_1.expectAnyTimestampWeb
      : firestore_js_1.expectAnyTimestampAdmin
  describe($env('collectionGroup'), () => {
    test('collection name duplication', () => {
      expect(() => {
        r.typedFirestoreWithCollectionDup.collectionGroup('users')
      }).not.toThrowError()
      expect(() => {
        r.typedFirestoreWithCollectionDup.collectionGroup('posts')
      }).toThrowError()
    })
  })
  describe($env('refs'), () => {
    test('ref equality', () => {
      expect(
        (0, _universal_js_1.refEqualUniv)(
          r.users.raw,
          (0, _universal_js_1.collectionUniv)(app, 'versions/v1/users'),
        ),
      ).toBe(false)
      expect(
        (0, _universal_js_1.refEqualUniv)(
          r.user.raw,
          (0, _universal_js_1.docFromRootUniv)(app, 'versions/v1/users/user'),
        ),
      ).toBe(false)
      expect(
        (0, _universal_js_1.refEqualUniv)(
          r.users.raw,
          r.v1.collection('users').raw,
        ),
      ).toBe(true)
      expect(
        (0, _universal_js_1.refEqualUniv)(
          r.user.raw,
          r.v1.collection('users').doc('user').raw,
        ),
      ).toBe(true)
    })
    env === 'web' &&
      test('query equality', () => {
        expect(
          (0, _universal_js_1.queryEqualUniv)(
            (0, _universal_js_1.buildQueryUniv)(r.users.raw, (q) => [
              q.where('age', '>=', 10),
              q.where('age', '<', 20),
            ]),
            r.teenUsers.raw,
          ),
        ).toBe(true)
        expect(
          (0, _universal_js_1.queryEqualUniv)(
            (0, _universal_js_1.buildQueryUniv)(r.usersGroup.raw, (q) => [
              q.where('age', '>=', 10),
              q.where('age', '<', 20),
            ]),
            r.teenUsersGroup.raw,
          ),
        ).toBe(true)
        expect(
          (0, _universal_js_1.queryEqualUniv)(
            (0, _universal_js_1.buildQueryUniv)(r.users.raw, (q) => [
              q.orderBy(firestoreStatic.documentId()),
            ]),
            r.usersOrderedById.raw,
          ),
        ).toBe(true)
      })
    test('doc() argument', () => {
      const a = r.users.doc()
      const b = r.users.doc(undefined)
      expect(a.id).toHaveLength(20)
      expect(b.id).toHaveLength(20)
    })
  })
  describe($env('class structure'), () => {
    test('parent of root collection is undefined', () => {
      const parentOfRootCollection = r.versions.parentDocument()
      expect(parentOfRootCollection).toBeUndefined()
    })
    test.each([
      {
        p: 'versions',
        l: 'versions',
        instances: [r.versions, r.v1.parentCollection()],
      },
      {
        p: 'versions/v1',
        l: 'versions',
        instances: [
          r.v1,
          r.users.parentDocument(),
          r.typedFirestore.wrapDocument(r.v1.raw),
        ],
      },
      {
        p: 'versions/v1/users',
        l: 'versions.users',
        instances: [r.users, r.user.parentCollection()],
      },
      {
        p: 'versions/v1/users/user',
        l: 'versions.users',
        instances: [
          r.user,
          r.posts.parentDocument(),
          r.typedFirestore.wrapDocument(r.user.raw),
        ],
      },
      {
        p: 'versions/v1/users/user/posts',
        l: 'versions.users.posts',
        instances: [r.posts, r.post.parentCollection()],
      },
      {
        p: 'versions/v1/users/user/posts/post',
        l: 'versions.users.posts',
        instances: [
          r.post,
          r.typedFirestore.wrapDocument(r.post.raw),
          r.typedFirestore.wrapDocument(
            // @ts-expect-error: wrong doc type
            r.post.raw,
          ),
        ],
      },
    ])('path, loc (C, D): %p', ({ p, l, instances }) => {
      const firstInstance = instances[0]
      for (const instance of instances) {
        expect(instance.path).toBe(p)
        expect(instance.options.loc).toEqual(l)
        expect(
          (0, _universal_js_1.refEqualUniv)(instance.raw, firstInstance.raw),
        ).toBe(true)
      }
    })
    test.each([
      {
        l: 'versions.users',
        instances: [r.teenUsers],
      },
      {
        l: 'versions.users',
        instances: [r.usersGroup],
      },
      {
        l: 'versions.users',
        instances: [r.teenUsersGroup],
      },
    ])('loc (Q): %p', ({ l, instances }) => {
      for (const instance of instances) {
        expect(instance.options.loc).toEqual(l)
      }
    })
  })
  const transformer = index_js_1.withRefTransformer
  describe($env('read'), () => {
    beforeEach(r.createInitialUserAndPost)
    test.each([
      {
        get: async () =>
          r.typedFirestore.runTransaction(async (tt) => tt.get(r.user)),
        getData: (0, type_extends_1.typeExtends)()(async (options) =>
          r.typedFirestore.runTransaction(async (tt) =>
            tt.getData(r.user, options),
          ),
        ),
      },
      r.user,
      r.posts.parentDocument(),
      r.typedFirestore.wrapDocument(r.user.raw),
    ])('get doc - user %#', async (ref) => {
      const snap = await ref.get()
      const [get, getR, getData, getDataR] = [
        snap.data(),
        snap.data({ transformer }),
        await ref.getData({}),
        await ref.getData({ transformer }),
      ]
      for (const data of [get, getR, getData, getDataR]) {
        // @ts-expect-error: ref not exists
        data.ref
        // @ts-expect-error: wrong data type
        ;(0, tsd_1.expectType)(data)
        expect(data).toMatchObject({
          ...data_js_1.userDataBase,
          timestamp: expect.any(String),
          id: snap.id,
        })
      }
      for (const data of [getR, getDataR]) {
        ;(0, tsd_1.expectType)(data)
        expect(
          (0, _universal_js_1.refEqualUniv)(data.ref.raw, r.user.raw),
        ).toBe(true)
      }
    })
    test.each([
      {
        get: async () =>
          r.typedFirestore.runTransaction(async (tt) => tt.get(r.post)),
        getData: (0, type_extends_1.typeExtends)()(async (options) =>
          r.typedFirestore.runTransaction(async (tt) =>
            tt.getData(r.post, options),
          ),
        ),
      },
      r.post,
      r.typedFirestore.wrapDocument(r.post.raw),
    ])('get doc - post %#', async (ref) => {
      const snap = await ref.get()
      const [get, getR, getData, getDataR] = [
        snap.data(),
        snap.data({ transformer }),
        await ref.getData({}),
        await ref.getData({ transformer }),
      ]
      for (const data of [get, getR, getData, getDataR]) {
        // @ts-expect-error: ref not exists
        data.ref
        // @ts-expect-error: wrong data type
        ;(0, tsd_1.expectType)(data)
        expect(data).toMatchObject({
          ...data_js_1.postAData,
          id: snap.id,
        })
      }
      for (const data of [getR, getDataR]) {
        ;(0, tsd_1.expectType)(data)
        expect(
          (0, _universal_js_1.refEqualUniv)(data.ref.raw, r.post.raw),
        ).toBe(true)
      }
    })
    test.each([r.users, r.user.parentCollection()])(
      'get collection - users %#',
      async (ref) => {
        const snap = await ref.get()
        const [get, getR, getData, getDataR] = [
          snap.docs[0].data(),
          snap.docs[0].data({ transformer }),
          (await ref.getData({}))[0],
          (await ref.getData({ transformer }))[0],
        ]
        expect(snap.docs).toHaveLength(1)
        for (const data of [get, getR, getData, getDataR]) {
          // @ts-expect-error: ref not exists
          data.ref
          // @ts-expect-error: wrong data type
          ;(0, tsd_1.expectType)(data)
          expect(data).toMatchObject({
            ...data_js_1.userDataBase,
            timestamp: expect.any(String),
            id: snap.docs[0].id,
          })
        }
        for (const data of [getR, getDataR]) {
          ;(0, tsd_1.expectType)(data)
          expect(
            (0, _universal_js_1.refEqualUniv)(data.ref.raw, r.user.raw),
          ).toBe(true)
        }
      },
    )
    test.each([r.teenUsers, r.teenUsersGroup])(
      'get query - users %#',
      async (query) => {
        const snap = await query.get()
        const [get, getR, getData, getDataR] = [
          snap.docs[0].data(),
          snap.docs[0].data({ transformer }),
          (await query.getData({}))[0],
          (await query.getData({ transformer }))[0],
        ]
        expect(snap.docs).toHaveLength(1)
        for (const data of [get, getR, getData, getDataR]) {
          // @ts-expect-error: ref not exists
          data.ref
          // @ts-expect-error: wrong data type
          ;(0, tsd_1.expectType)(data)
          expect(data).toMatchObject({
            ...data_js_1.userDataBase,
            timestamp: expect.any(String),
            id: snap.docs[0].id,
          })
        }
        for (const data of [getR, getDataR]) {
          ;(0, tsd_1.expectType)(data)
        }
      },
    )
    test.each([
      {
        get: async () => {
          const usersSnap = await r.users.get()
          const userRef = usersSnap.docs[0].ref
          return userRef.collection('posts').get()
        },
        getData: (0, type_extends_1.typeExtends)()(async (options) => {
          const usersSnap = await r.users.get()
          const userRef = usersSnap.docs[0].ref
          return userRef.collection('posts').getData(options)
        }),
      },
      r.posts,
      r.post.parentCollection(),
    ])('get collection - posts %#', async (ref) => {
      const snap = await ref.get()
      const [get, getR, getData, getDataR] = [
        snap.docs[0].data(),
        snap.docs[0].data({ transformer }),
        (await ref.getData({}))[0],
        (await ref.getData({ transformer }))[0],
      ]
      expect(snap.docs).toHaveLength(1)
      for (const data of [get, getR, getData, getDataR]) {
        // @ts-expect-error: ref not exists
        data.ref
        // @ts-expect-error: wrong data type
        ;(0, tsd_1.expectType)(data)
        expect(data).toMatchObject({
          ...data_js_1.postAData,
          id: snap.docs[0].id,
        })
      }
      for (const data of [getR, getDataR]) {
        ;(0, tsd_1.expectType)(data)
        expect(
          (0, _universal_js_1.refEqualUniv)(data.ref.raw, r.post.raw),
        ).toBe(true)
      }
    })
  })
  env === 'web' &&
    describe($env('write (test rules)'), () => {
      test('create user (empty array)', async () => {
        await r.user.create({ ...r.userData, tags: [] })
      })
      test('create user (fails due to invalid timestamp)', async () => {
        const serverTs = () => firestoreStatic.serverTimestamp()
        const localTs = () => firestoreStatic.Timestamp.fromDate(new Date())
        for (const data of [
          { ...r.userData, [index_js_1._createdAt]: serverTs() },
          { ...r.userData, [index_js_1._updatedAt]: serverTs() },
          {
            ...r.userData,
            [index_js_1._createdAt]: localTs(),
            [index_js_1._updatedAt]: serverTs(),
          },
          {
            ...r.userData,
            [index_js_1._createdAt]: serverTs(),
            [index_js_1._updatedAt]: localTs(),
          },
        ]) {
          await (0, app_js_1.assertFails)(async () =>
            (0, _universal_js_1.setDocUniv)(r.user.raw, data),
          )
        }
        await (0, _universal_js_1.setDocUniv)(r.user.raw, {
          ...r.userData,
          [index_js_1._createdAt]: serverTs(),
          [index_js_1._updatedAt]: serverTs(),
        })
        for (const data of [
          { [index_js_1._createdAt]: serverTs() },
          {
            [index_js_1._createdAt]: serverTs(),
            [index_js_1._updatedAt]: serverTs(),
          },
          { [index_js_1._updatedAt]: localTs() },
        ]) {
          await (0, app_js_1.assertFails)(async () =>
            (0, _universal_js_1.updateDocUniv)(r.user.raw, data),
          )
        }
        await (0, _universal_js_1.updateDocUniv)(r.user.raw, {
          [index_js_1._updatedAt]: serverTs(),
        })
      })
      test('create user (fails due to invalid data)', async () => {
        await (0, app_js_1.assertFails)(async () =>
          r.user.create({
            ...r.userData,
            // @ts-expect-error: number
            age: '20',
          }),
        )
        await (0, app_js_1.assertFails)(async () =>
          r.user.create({
            ...r.userData,
            // @ts-expect-error: options.a
            options: { a: 1, b: 'value' },
          }),
        )
        await (0, app_js_1.assertFails)(async () =>
          r.user.create({
            ...r.userData,
            // @ts-expect-error: excess property
            excessProperty: 'text',
          }),
        )
      })
      test('create user (fails due to unauthed)', async () => {
        await (0, app_js_1.assertFails)(async () =>
          ur.user.create(data_js_1.createUserData),
        )
      })
      describe('write to non-existing doc', () => {
        test('setMerge fails', async () => {
          await (0, app_js_1.assertFails)(async () =>
            r.user.setMerge(data_js_1.createUserData),
          )
        })
        test('update fails', async () => {
          await (0, app_js_1.assertFails)(async () =>
            r.user.update(data_js_1.createUserData),
          )
        })
      })
      test('overwrite user fails', async () => {
        await r.user.create(data_js_1.createUserData)
        await r.user.update(data_js_1.createUserData)
        await (0, app_js_1.assertFails)(async () =>
          r.user.create(data_js_1.createUserData),
        )
      })
    })
  describe($env('write'), () => {
    test.each([
      async () => {
        await r.user.create(data_js_1.createUserData)
        // @ts-expect-error: wrong data type
        void (async () => r.user.create(postData))
      },
      async () => {
        const b = r.typedFirestore.batch()
        b.create(r.user, data_js_1.createUserData)
        // @ts-expect-error: wrong data type
        void (() => b.create(r.user, data_js_1.postAData))
        await b.commit()
      },
      async () => {
        await r.typedFirestore.runTransaction(async (tt) => {
          tt.create(r.user, data_js_1.createUserData)
          // @ts-expect-error: wrong data type
          void (() => tt.create(r.user, data_js_1.postAData))
        })
      },
    ])('create user %#', async (fn) => {
      await fn()
      const snapRaw = await (0, _universal_js_1.getDocUniv)(
        (0, _universal_js_1.docUniv)(r.usersRaw, 'user'),
        undefined,
      )
      expect(snapRaw.data()).toMatchObject({
        ...data_js_1.userDataBase,
        _createdAt: expectAnyTimestamp(),
        _updatedAt: expectAnyTimestamp(),
        timestamp: expectAnyTimestamp(),
      })
    })
  })
  describe($env('write (with initial docs)'), () => {
    beforeEach(r.createInitialUserAndPost)
    const userUpdateData = {
      name: 'name1-updated',
      tags: firestoreStatic.arrayUnion({ id: 2, name: 'tag2' }),
    }
    for (const op of ['setMerge', 'update']) {
      test.each([
        async () => {
          await r.user[op](userUpdateData)
          // @ts-expect-error: wrong data type
          void (async () => r.user[op](data_js_1.postAData))
        },
        async () => {
          const b = r.typedFirestore.batch()
          b[op](r.user, userUpdateData)
          // @ts-expect-error: wrong data type
          void (() => b[op](r.user, data_js_1.postAData))
          await b.commit()
        },
        async () => {
          await r.typedFirestore.runTransaction(async (tt) => {
            tt[op](r.user, userUpdateData)
            // @ts-expect-error: wrong data type
            void (() => tt[op](r.user, data_js_1.postAData))
          })
        },
      ])(`${op} user %#`, async (fn) => {
        await fn()
        const snapRaw = await (0, _universal_js_1.getDocUniv)(
          (0, _universal_js_1.docUniv)(r.usersRaw, 'user'),
          undefined,
        )
        expect(snapRaw.data()).toMatchObject({
          ...data_js_1.userDataBase,
          name: 'name1-updated',
          tags: [...data_js_1.userDataBase.tags, { id: 2, name: 'tag2' }],
          _updatedAt: expectAnyTimestamp(),
          timestamp: expectAnyTimestamp(),
        })
      })
      test.each([
        async () => {
          await r.typedFirestore.runTransaction(async (tt) => {
            const tsnap = await tt.get(r.user)
            tt[op](r.user, {
              age: tsnap.data().age + 1,
            })
          })
        },
      ])(`${op} user (transaction using .get()) %#`, async (fn) => {
        await fn()
        const snapRaw = await (0, _universal_js_1.getDocUniv)(
          (0, _universal_js_1.docUniv)(r.usersRaw, 'user'),
          undefined,
        )
        expect(snapRaw.data()).toMatchObject({
          ...data_js_1.userDataBase,
          age: data_js_1.userDataBase.age + 1,
          _updatedAt: expectAnyTimestamp(),
          timestamp: expectAnyTimestamp(),
        })
      })
    }
    test.each([
      async () => {
        await r.user.delete()
      },
      async () => {
        const b = r.typedFirestore.batch()
        b.delete(r.user)
        await b.commit()
      },
      async () => {
        await r.typedFirestore.runTransaction(async (tt) => {
          tt.delete(r.user)
        })
      },
    ])('delete user %#', async (fn) => {
      await fn()
      const snapRaw = await (0, _universal_js_1.getDocUniv)(
        (0, _universal_js_1.docUniv)(r.usersRaw, 'user'),
        undefined,
      )
      expect((0, _universal_js_1.existsUniv)(snapRaw)).toBeFalsy()
    })
  })
  env === 'web' &&
    describe($env('hooks'), () => {
      beforeEach(r.createInitialUserAndPost)
      beforeEach(() => {
        const _globalThis = globalThis
        _globalThis._reactFirePreloadedObservables.clear()
        _globalThis._reactFireFirestoreQueryCache.splice(0)
      })
      describe('useTypedDocument', () => {
        test('safeRef', async () => {
          let ref
          const updateRef = () => {
            const typedDoc = r.users.doc('user')
            typedDoc.raw = typedDoc.raw.withConverter({
              toFirestore: (data) => data,
              fromFirestore: (snap) => snap.data(),
            })
            ref = typedDoc
          }
          updateRef()
          const { result, rerender, waitForNextUpdate, unmount } = (0,
          react_hooks_1.renderHook)(() =>
            (0, useTypedDocument_js_1.useTypedDoc)(ref),
          )
          expect(result.current).toBe(undefined)
          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(index_js_1.TypedDocumentSnap),
          })
          expect(result.all.length).toBe(2)
          const typedRef1 = result.current.ref
          rerender()
          expect(typedRef1 === result.current.ref).toBe(true)
          const typedRef2 = result.current.ref
          updateRef()
          rerender()
          await (0, common_js_1.sleep)(100)
          expect(typedRef2 === result.current.ref).toBe(false)
          const consoleMock = jest.spyOn(console, 'error').mockImplementation()
          for (const i of fp_js_1.R.range(0, 8)) {
            updateRef()
            rerender()
            await (0, common_js_1.sleep)(100)
          }
          consoleMock.mockRestore()
          expect(result.all.length).toBe(5)
          unmount()
        })
        test.each([
          useTypedDocument_js_1.useTypedDoc,
          useTypedDocument_js_1.useTypedDocOnce,
        ])('without transformer %#', async (hook) => {
          const { result, waitForNextUpdate, unmount } = (0,
          react_hooks_1.renderHook)(() => hook(r.user))
          expect(result.current).toBe(undefined)
          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(index_js_1.TypedDocumentSnap),
            data: { ...data_js_1.userDataBase, timestamp: expect.any(String) },
          })
          expect(
            (0, _universal_js_1.refEqualUniv)(
              result.current.snap.ref.raw,
              r.user.raw,
            ),
          ).toBe(true)
          ;(0, tsd_1.expectType)(result.current.data)
          // @ts-expect-error: wrong data type
          ;(0, tsd_1.expectType)(result.current.data)
          unmount()
        })
        test.each([
          useTypedDocument_js_1.useTypedDoc,
          useTypedDocument_js_1.useTypedDocOnce,
        ])('with transformer %#', async (hook) => {
          const { result, waitForNextUpdate, unmount } = (0,
          react_hooks_1.renderHook)(() =>
            hook(r.user, {
              transformer: (data, snap) => {
                ;(0, tsd_1.expectType)(snap)
                return data.name
              },
            }),
          )
          expect(result.current).toBe(undefined)
          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(index_js_1.TypedDocumentSnap),
            data: data_js_1.userDataBase.name,
          })
          expect(
            (0, _universal_js_1.refEqualUniv)(
              result.current.snap.ref.raw,
              r.user.raw,
            ),
          ).toBe(true)
          ;(0, tsd_1.expectType)(result.current.data)
          // @ts-expect-error: wrong data type
          ;(0, tsd_1.expectType)(result.current.data)
          unmount()
        })
      })
      describe('useTypedCollection', () => {
        test('safeRef', async () => {
          let random = 0
          const updateRef = () => {
            random = Math.random()
          }
          updateRef()
          const { result, rerender, waitForNextUpdate, unmount } = (0,
          react_hooks_1.renderHook)(() =>
            (0, useTypedCollection_js_1.useTypedCollection)(
              r.users.select._teen(random),
            ),
          )
          expect(result.current).toBe(undefined)
          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(index_js_1.TypedQuerySnap),
          })
          expect(result.all.length).toBe(2)
          const typedRef1 = result.current.ref
          rerender()
          expect(typedRef1 === result.current.ref).toBe(true)
          const consoleMock = jest.spyOn(console, 'error').mockImplementation()
          for (const i of fp_js_1.R.range(0, 8)) {
            updateRef()
            rerender()
            await (0, common_js_1.sleep)(100)
          }
          consoleMock.mockRestore()
          expect(result.all.length).toBe(7)
          unmount()
        })
        test.each([
          useTypedCollection_js_1.useTypedCollection /** useTypedQueryOnce */,
        ])('without transformer %#', async (hook) => {
          const { result, waitForNextUpdate, unmount } = (0,
          react_hooks_1.renderHook)(() => hook(r.users.select.teen()))
          expect(result.current).toBe(undefined)
          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(index_js_1.TypedQuerySnap),
            data: [
              { ...data_js_1.userDataBase, timestamp: expect.any(String) },
            ],
          })
          expect(
            (0, _universal_js_1.refEqualUniv)(
              result.current.snap.docs[0].ref.raw,
              r.user.raw,
            ),
          ).toBe(true)
          ;(0, tsd_1.expectType)(result.current.data[0])
          // @ts-expect-error: wrong data type
          ;(0, tsd_1.expectType)(result.current.data[0])
          unmount()
        })
        test.each([
          useTypedCollection_js_1.useTypedCollection /** useTypedQueryOnce */,
        ])('with transformer %#', async (hook) => {
          const { result, waitForNextUpdate, unmount } = (0,
          react_hooks_1.renderHook)(() =>
            hook(r.users.select.teen(), {
              transformer: (data, snap) => {
                ;(0, tsd_1.expectType)(snap)
                return data.name
              },
            }),
          )
          expect(result.current).toBe(undefined)
          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(index_js_1.TypedQuerySnap),
            data: [data_js_1.userDataBase.name],
          })
          expect(
            (0, _universal_js_1.refEqualUniv)(
              result.current.snap.docs[0].ref.raw,
              r.user.raw,
            ),
          ).toBe(true)
          ;(0, tsd_1.expectType)(result.current.data[0])
          // @ts-expect-error: wrong data type
          ;(0, tsd_1.expectType)(result.current.data[0])
          unmount()
        })
      })
    })
}
