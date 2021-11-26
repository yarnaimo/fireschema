import { renderHook } from '@testing-library/react-hooks'
import { typeExtends } from '@yarnaimo/type-extends'
import { ReactFireGlobals } from 'reactfire'
import { expectType } from 'tsd'

import {
  buildQueryUniv,
  collectionUniv,
  docFromRootUniv,
  docUniv,
  existsUniv,
  getDocUniv,
  queryEqualUniv,
  refEqualUniv,
  setDocUniv,
  updateDocUniv,
} from '../../core/firestore/controller/_universal.js'
import {
  FTypes,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
  TypedQueryDocumentSnap,
  TypedQueryRef,
  TypedQuerySnap,
  _createdAt,
  _updatedAt,
  withRefTransformer,
} from '../../core/index.js'
import { CollectionNameToLoc } from '../../core/types/_object.js'
import { getCollectionOptionsByName } from '../../core/utils/_object.js'
import { useTypedDoc, useTypedDocOnce } from '../../hooks/useTypedDocument.js'
import { useTypedQuery } from '../../hooks/useTypedQuery.js'
import { R } from '../../lib/fp.js'
import { createUserData, postAData, userDataBase } from '../_fixtures/data.js'
import {
  IUser,
  IUserLocal,
  PostModel,
  UserModel,
  firestoreModel,
} from '../_fixtures/firestore-schema.js'
import {
  assertFails,
  getTestAppAdmin,
  getTestAppWeb,
} from '../_services/app.js'
import {
  F,
  PostU,
  S,
  UserU,
  _tcollections,
  firestoreModelWithDup,
} from '../_services/firestore-collections.js'
import { sleep } from '../_utils/common.js'
import {
  expectAnyTimestampAdmin,
  expectAnyTimestampWeb,
} from '../_utils/firestore.js'

describe('types', () => {
  test('decoder', () => {
    expectType<
      (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>) => IUserLocal
    >(UserModel.decoder)

    expectType<undefined>(PostModel.decoder)
  })

  test('UAt', () => {
    expectType<UserU>({} as STypes.DocDataAt<S, F, 'versions.users'>)
    expectType<PostU>(
      // @ts-expect-error: wrong U type
      {} as STypes.DocDataAt<S, F, 'versions.users'>,
    )
  })

  test('CollectionNameToLoc', () => {
    expectType<'versions.users'>({} as CollectionNameToLoc<S, 'users'>)
    expectType<'versions.users.posts'>({} as CollectionNameToLoc<S, 'posts'>)
  })
})

describe('utils', () => {
  test('getCollectionOptionsByName', () => {
    expect(
      getCollectionOptionsByName(firestoreModel.schemaOptions, 'posts'),
    ).toEqual([
      {
        loc: 'versions.users.posts',
        options: expect.objectContaining({ model: PostModel }),
      },
    ])

    expect(
      getCollectionOptionsByName(firestoreModelWithDup.schemaOptions, 'posts'),
    ).toEqual([
      {
        loc: 'versions.users.posts',
        options: expect.objectContaining({ model: PostModel }),
      },
      {
        loc: 'posts',
        options: expect.objectContaining({ model: PostModel }),
      },
    ])
  })
})

for (const env of ['web', 'admin'] as const) {
  const $env = (str: string) => `[${env}] ${str}`

  const app =
    env === 'web'
      ? getTestAppWeb('user').firestore()
      : getTestAppAdmin().firestore()
  const appUnauthed =
    env === 'web'
      ? getTestAppWeb('unauthed').firestore()
      : getTestAppAdmin().firestore()

  const r = _tcollections(app, env)
  const ur = _tcollections(appUnauthed, env)
  const firestoreStatic = r.typedFirestore.firestoreStatic

  const expectAnyTimestamp =
    env === 'web' ? expectAnyTimestampWeb : expectAnyTimestampAdmin

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
        refEqualUniv(r.users.raw, collectionUniv(app, 'versions/v1/users')),
      ).toBe(false)
      expect(
        refEqualUniv(
          r.user.raw,
          docFromRootUniv(app, 'versions/v1/users/user'),
        ),
      ).toBe(false)

      expect(refEqualUniv(r.users.raw, r.v1.collection('users').raw)).toBe(true)
      expect(
        refEqualUniv(r.user.raw, r.v1.collection('users').doc('user').raw),
      ).toBe(true)
    })

    env === 'web' &&
      test('query equality', () => {
        expect(
          queryEqualUniv(
            buildQueryUniv(r.users.raw, (q) => [
              q.where('age', '>=', 10),
              q.where('age', '<', 20),
            ]),
            r.teenUsers.raw,
          ),
        ).toBe(true)

        expect(
          queryEqualUniv(
            buildQueryUniv(r.usersGroup.raw, (q) => [
              q.where('age', '>=', 10),
              q.where('age', '<', 20),
            ]),
            r.teenUsersGroup.raw,
          ),
        ).toBe(true)

        expect(
          queryEqualUniv(
            buildQueryUniv(r.users.raw, (q) => [
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
      const parentOfRootCollection: undefined = r.versions.parentDocument()
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
          r.typedFirestore.wrapDocument<typeof r.user.raw>(
            // @ts-expect-error: wrong doc type
            r.post.raw,
          ),
        ],
      },
    ])('path, loc (C, D): %p', ({ p, l, instances }) => {
      const firstInstance = instances[0]!
      for (const instance of instances) {
        expect(instance.path).toBe(p)
        expect(instance.options.loc).toEqual(l)
        expect(refEqualUniv<any>(instance.raw, firstInstance.raw)).toBe(true)
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

  const transformer = withRefTransformer

  describe($env('read'), () => {
    beforeEach(r.createInitialUserAndPost)

    test.each([
      {
        get: async () =>
          r.typedFirestore.runTransaction(async (tt) => tt.get(r.user)),
        getData: typeExtends<
          TypedDocumentRef<S, F, 'versions.users'>['getData']
        >()(async (options) =>
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
        snap.data()!,
        snap.data({ transformer })!,
        (await ref.getData({}))!,
        (await ref.getData({ transformer }))!,
      ]

      for (const data of [get, getR, getData, getDataR]) {
        // @ts-expect-error: ref not exists
        data.ref
        // @ts-expect-error: wrong data type
        expectType<PostU>(data)
        expect<UserU>(data).toMatchObject({
          ...userDataBase,
          timestamp: expect.any(String),
          id: snap.id,
        })
      }

      for (const data of [getR, getDataR]) {
        expectType<UserU & { ref: TypedDocumentRef<S, F, 'versions.users'> }>(
          data,
        )
        expect(refEqualUniv(data.ref.raw, r.user.raw)).toBe(true)
      }
    })

    test.each([
      {
        get: async () =>
          r.typedFirestore.runTransaction(async (tt) => tt.get(r.post)),
        getData: typeExtends<
          TypedDocumentRef<S, F, 'versions.users.posts'>['getData']
        >()(async (options) =>
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
        snap.data()!,
        snap.data({ transformer })!,
        (await ref.getData({}))!,
        (await ref.getData({ transformer }))!,
      ]

      for (const data of [get, getR, getData, getDataR]) {
        // @ts-expect-error: ref not exists
        data.ref
        // @ts-expect-error: wrong data type
        expectType<UserU>(data)
        expect<PostU>(data).toMatchObject({
          ...postAData,
          id: snap.id,
        })
      }

      for (const data of [getR, getDataR]) {
        expectType<
          PostU & { ref: TypedDocumentRef<S, F, 'versions.users.posts'> }
        >(data)
        expect(refEqualUniv(data.ref.raw, r.post.raw)).toBe(true)
      }
    })

    test.each([r.users, r.user.parentCollection()])(
      'get collection - users %#',
      async (ref) => {
        const snap = await ref.get()
        const [get, getR, getData, getDataR] = [
          snap.typedDocs[0]!.data(),
          snap.typedDocs[0]!.data({ transformer })!,
          (await ref.getData({}))[0]!,
          (await ref.getData({ transformer }))[0]!,
        ]

        expect(snap.typedDocs).toHaveLength(1)

        for (const data of [get, getR, getData, getDataR]) {
          // @ts-expect-error: ref not exists
          data.ref
          // @ts-expect-error: wrong data type
          expectType<PostU>(data)
          expect<UserU>(data).toMatchObject({
            ...userDataBase,
            timestamp: expect.any(String),
            id: snap.typedDocs[0].id,
          })
        }

        for (const data of [getR, getDataR]) {
          expectType<UserU & { ref: TypedDocumentRef<S, F, 'versions.users'> }>(
            data,
          )
          expect(refEqualUniv(data.ref.raw, r.user.raw)).toBe(true)
        }
      },
    )

    test.each([r.teenUsers, r.teenUsersGroup])(
      'get query - users %#',
      async (query) => {
        const snap = await query.get()
        const [get, getR, getData, getDataR] = [
          snap.typedDocs[0]!.data(),
          snap.typedDocs[0]!.data({ transformer })!,
          (await query.getData({}))[0]!,
          (await query.getData({ transformer }))[0]!,
        ]

        expect(snap.typedDocs).toHaveLength(1)

        for (const data of [get, getR, getData, getDataR]) {
          // @ts-expect-error: ref not exists
          data.ref
          // @ts-expect-error: wrong data type
          expectType<PostU>(data)
          expect<UserU>(data).toMatchObject({
            ...userDataBase,
            timestamp: expect.any(String),
            id: snap.typedDocs[0].id,
          })
        }

        for (const data of [getR, getDataR]) {
          expectType<UserU & { ref: TypedDocumentRef<S, F, 'versions.users'> }>(
            data,
          )
        }
      },
    )

    test.each([
      {
        get: async () => {
          const usersSnap = await r.users.get()
          const userRef = usersSnap.typedDocs[0]!.typedRef
          return userRef.collection('posts').get()
        },
        getData: typeExtends<
          TypedQueryRef<S, F, 'versions.users.posts'>['getData']
        >()(async (options) => {
          const usersSnap = await r.users.get()
          const userRef = usersSnap.typedDocs[0]!.typedRef
          return userRef.collection('posts').getData(options)
        }),
      },
      r.posts,
      r.post.parentCollection(),
    ])('get collection - posts %#', async (ref) => {
      const snap = await ref.get()
      const [get, getR, getData, getDataR] = [
        snap.typedDocs[0]!.data(),
        snap.typedDocs[0]!.data({ transformer })!,
        (await ref.getData({}))[0]!,
        (await ref.getData({ transformer }))[0]!,
      ]

      expect(snap.typedDocs).toHaveLength(1)

      for (const data of [get, getR, getData, getDataR]) {
        // @ts-expect-error: ref not exists
        data.ref
        // @ts-expect-error: wrong data type
        expectType<UserU>(data)
        expect<PostU>(data).toMatchObject({
          ...postAData,
          id: snap.typedDocs[0].id,
        })
      }

      for (const data of [getR, getDataR]) {
        expectType<
          PostU & { ref: TypedDocumentRef<S, F, 'versions.users.posts'> }
        >(data)
        expect(refEqualUniv(data.ref.raw, r.post.raw)).toBe(true)
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
          { ...r.userData, [_createdAt]: serverTs() },
          { ...r.userData, [_updatedAt]: serverTs() },
          { ...r.userData, [_createdAt]: localTs(), [_updatedAt]: serverTs() },
          { ...r.userData, [_createdAt]: serverTs(), [_updatedAt]: localTs() },
        ]) {
          await assertFails(async () => setDocUniv(r.user.raw, data as any))
        }

        await setDocUniv(r.user.raw, {
          ...r.userData,
          [_createdAt]: serverTs(),
          [_updatedAt]: serverTs(),
        } as any)

        for (const data of [
          { [_createdAt]: serverTs() },
          { [_createdAt]: serverTs(), [_updatedAt]: serverTs() },
          { [_updatedAt]: localTs() },
        ]) {
          await assertFails(async () => updateDocUniv(r.user.raw, data as any))
        }

        await updateDocUniv(r.user.raw, {
          [_updatedAt]: serverTs(),
        } as any)
      })

      test('create user (fails due to invalid data)', async () => {
        await assertFails(async () =>
          r.user.create({
            ...r.userData,
            // @ts-expect-error: number
            age: '20',
          }),
        )

        await assertFails(async () =>
          r.user.create({
            ...r.userData,
            // @ts-expect-error: options.a
            options: { a: 1, b: 'value' },
          }),
        )

        await assertFails(async () =>
          r.user.create({
            ...r.userData,
            // @ts-expect-error: excess property
            excessProperty: 'text',
          }),
        )
      })

      test('create user (fails due to unauthed)', async () => {
        await assertFails(async () => ur.user.create(createUserData))
      })

      describe('write to non-existing doc', () => {
        test('setMerge fails', async () => {
          await assertFails(async () => r.user.setMerge(createUserData))
        })

        test('update fails', async () => {
          await assertFails(async () => r.user.update(createUserData))
        })
      })

      test('overwrite user fails', async () => {
        await r.user.create(createUserData)
        await r.user.update(createUserData)
        await assertFails(async () => r.user.create(createUserData))
      })
    })

  describe($env('write'), () => {
    test.each([
      async () => {
        await r.user.create(createUserData)
        // @ts-expect-error: wrong data type
        void (async () => r.user.create(postData))
      },
      async () => {
        const b = r.typedFirestore.batch()
        b.create(r.user, createUserData)
        // @ts-expect-error: wrong data type
        void (() => b.create(r.user, postAData))
        await b.commit()
      },
      async () => {
        await r.typedFirestore.runTransaction(async (tt) => {
          tt.create(r.user, createUserData)
          // @ts-expect-error: wrong data type
          void (() => tt.create(r.user, postAData))
        })
      },
    ])('create user %#', async (fn) => {
      await fn()

      const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined)
      expect(snapRaw.data()).toMatchObject({
        ...userDataBase,
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
    for (const op of ['setMerge', 'update'] as const) {
      test.each([
        async () => {
          await r.user[op](userUpdateData)
          // @ts-expect-error: wrong data type
          void (async () => r.user[op](postAData))
        },
        async () => {
          const b = r.typedFirestore.batch()
          b[op](r.user, userUpdateData)
          // @ts-expect-error: wrong data type
          void (() => b[op](r.user, postAData))
          await b.commit()
        },
        async () => {
          await r.typedFirestore.runTransaction(async (tt) => {
            tt[op](r.user, userUpdateData)
            // @ts-expect-error: wrong data type
            void (() => tt[op](r.user, postAData))
          })
        },
      ])(`${op} user %#`, async (fn) => {
        await fn()

        const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined)
        expect(snapRaw.data()).toMatchObject({
          ...userDataBase,
          name: 'name1-updated',
          tags: [...userDataBase.tags, { id: 2, name: 'tag2' }],
          _updatedAt: expectAnyTimestamp(),
          timestamp: expectAnyTimestamp(),
        })
      })

      test.each([
        async () => {
          await r.typedFirestore.runTransaction(async (tt) => {
            const tsnap = await tt.get(r.user)
            tt[op](r.user, {
              age: tsnap.data()!.age + 1,
            })
          })
        },
      ])(`${op} user (transaction using .get()) %#`, async (fn) => {
        await fn()

        const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined)
        expect(snapRaw.data()).toMatchObject({
          ...userDataBase,
          age: userDataBase.age + 1,
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

      const snapRaw = await getDocUniv(docUniv(r.usersRaw, 'user'), undefined)
      expect(existsUniv(snapRaw)).toBeFalsy()
    })
  })

  env === 'web' &&
    describe($env('hooks'), () => {
      beforeEach(r.createInitialUserAndPost)
      beforeEach(() => {
        const _globalThis = globalThis as any as ReactFireGlobals
        _globalThis._reactFirePreloadedObservables.clear()
        _globalThis._reactFireFirestoreQueryCache.splice(0)
      })

      describe('useTypedDocument', () => {
        test('safeRef', async () => {
          let ref: any
          const updateRef = () => {
            const typedDoc = r.users.doc('user')
            ;(typedDoc.raw as any) = (typedDoc.raw.withConverter as any)({
              toFirestore: (data: any) => data,
              fromFirestore: (snap: any) => snap.data(),
            })
            ref = typedDoc
          }
          updateRef()

          const { result, rerender, waitForNextUpdate, unmount } = renderHook(
            () => useTypedDoc(ref),
          )
          expect(result.current).toBe(undefined)

          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(TypedDocumentSnap),
          })
          expect(result.all.length).toBe(2)

          const consoleMock = jest.spyOn(console, 'error').mockImplementation()
          for (const i of R.range(0, 8)) {
            updateRef()
            rerender()
            await sleep(100)
          }
          consoleMock.mockRestore()
          expect(result.all.length).toBe(4)

          unmount()
        })

        test.each([useTypedDoc, useTypedDocOnce])(
          'without transformer %#',
          async (hook) => {
            const { result, waitForNextUpdate, unmount } = renderHook(() =>
              hook(r.user),
            )
            expect(result.current).toBe(undefined)

            await waitForNextUpdate()
            expect(result.current).toMatchObject({
              error: undefined,
              snap: expect.any(TypedDocumentSnap),
              data: { ...userDataBase, timestamp: expect.any(String) },
            })
            expect(
              refEqualUniv(result.current!.snap.typedRef.raw, r.user.raw),
            ).toBe(true)

            expectType<UserU>(result.current!.data!)
            // @ts-expect-error: wrong data type
            expectType<PostU>(result.current!.data!)
            unmount()
          },
        )

        test.each([useTypedDoc, useTypedDocOnce])(
          'with transformer %#',
          async (hook) => {
            const { result, waitForNextUpdate, unmount } = renderHook(() =>
              hook(r.user, {
                transformer: (data, snap) => {
                  expectType<TypedDocumentSnap<S, F, 'versions.users'>>(snap)
                  return data.name
                },
              }),
            )
            expect(result.current).toBe(undefined)

            await waitForNextUpdate()
            expect(result.current).toMatchObject({
              error: undefined,
              snap: expect.any(TypedDocumentSnap),
              data: userDataBase.name,
            })
            expect(
              refEqualUniv(result.current!.snap.typedRef.raw, r.user.raw),
            ).toBe(true)

            expectType<string>(result.current!.data!)
            // @ts-expect-error: wrong data type
            expectType<number>(result.current!.data!)
            unmount()
          },
        )
      })

      describe('useTypedQuery', () => {
        test('safeRef', async () => {
          let ref: any
          const updateRef = () => {
            ref = r.v1.collection('users').select._teen()
          }
          updateRef()

          const { result, rerender, waitForNextUpdate, unmount } = renderHook(
            () => useTypedQuery(ref),
          )
          expect(result.current).toBe(undefined)

          await waitForNextUpdate()
          expect(result.current).toMatchObject({
            error: undefined,
            snap: expect.any(TypedQuerySnap),
          })
          expect(result.all.length).toBe(2)

          const consoleMock = jest.spyOn(console, 'error').mockImplementation()
          for (const i of R.range(0, 8)) {
            updateRef()
            rerender()
            await sleep(100)
          }
          consoleMock.mockRestore()
          expect(result.all.length).toBe(6)

          unmount()
        })

        test.each([useTypedQuery /** useTypedQueryOnce */])(
          'without transformer %#',
          async (hook) => {
            const { result, waitForNextUpdate, unmount } = renderHook(() =>
              hook(r.teenUsers),
            )
            expect(result.current).toBe(undefined)

            await waitForNextUpdate()
            expect(result.current).toMatchObject({
              error: undefined,
              snap: expect.any(TypedQuerySnap),
              data: [{ ...userDataBase, timestamp: expect.any(String) }],
            })
            expect(
              refEqualUniv(
                result.current!.snap.typedDocs[0]!.typedRef.raw,
                r.user.raw,
              ),
            ).toBe(true)

            expectType<UserU>(result.current!.data[0]!)
            // @ts-expect-error: wrong data type
            expectType<PostU>(result.current!.data[0]!)
            unmount()
          },
        )

        test.each([useTypedQuery /** useTypedQueryOnce */])(
          'with transformer %#',
          async (hook) => {
            const { result, waitForNextUpdate, unmount } = renderHook(() =>
              hook(r.teenUsers, {
                transformer: (data, snap) => {
                  expectType<TypedQueryDocumentSnap<S, F, 'versions.users'>>(
                    snap,
                  )
                  return data.name
                },
              }),
            )
            expect(result.current).toBe(undefined)

            await waitForNextUpdate()
            expect(result.current).toMatchObject({
              error: undefined,
              snap: expect.any(TypedQuerySnap),
              data: [userDataBase.name],
            })
            expect(
              refEqualUniv(
                result.current!.snap.typedDocs[0]!.typedRef.raw,
                r.user.raw,
              ),
            ).toBe(true)

            expectType<string>(result.current!.data[0]!)
            // @ts-expect-error: wrong data type
            expectType<number>(result.current!.data[0]!)
            unmount()
          },
        )
      })
    })
}
