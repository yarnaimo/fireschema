import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { renderHook } from '@testing-library/react-hooks'
import { typeExtends } from '@yarnaimo/type-extends'
import { getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore'
import { Firestore } from 'firebase/firestore'
import { expectType } from 'tsd'
import {
  FTypes,
  STypes,
  TypedDocumentRef,
  TypedDocumentSnap,
  TypedFirestoreUniv,
  TypedFirestoreWeb,
  TypedQueryDocumentSnap,
  TypedQueryRef,
  TypedQuerySnap,
  withRefTransformer,
  _createdAt,
  _updatedAt,
} from '../../core/index.js'
import { TypedFirestoreAdmin } from '../../core/firestore/controller/_TypedFirestoreAdmin.js'
import {
  collectionUniv,
  docFromRootUniv,
  docUniv,
  existsUniv,
  getDocUniv,
  queryEqualUniv,
  queryUniv,
  refEqualUniv,
  setDocUniv,
  updateDocUniv,
} from '../../core/firestore/controller/_universal.js'
import {
  useTypedDocument,
  useTypedDocumentOnce,
  useTypedQuery,
  useTypedQueryOnce,
} from '../../hooks/index.js'
import { R } from '../../lib/fp.js'
import { createUserData, postAData } from '../_fixtures/data.js'
import {
  firestoreModel,
  IPostA,
  IPostB,
  IUser,
  IUserLocal,
  PostModel,
  UserModel,
} from '../_fixtures/firestore-schema.js'
import { authedAdminApp, authedApp } from '../_infrastructure/_app.js'
import { sleep } from '../_utils/common.js'
import {
  expectAnyTimestampAdmin,
  expectAnyTimestampWeb,
} from '../_utils/firestore.js'

type S = typeof firestoreModel.schemaOptions
type F = FTypes.FirestoreApp

type Env = 'web' | 'admin'

const _tcollections = (app: F, env: Env) => {
  const typedFirestore = (
    env === 'web'
      ? new TypedFirestoreWeb(firestoreModel, app as any)
      : new TypedFirestoreAdmin(firestoreModel, app as any)
  ) as TypedFirestoreUniv<typeof firestoreModel, F>

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
  const teenUsers = v1.collectionQuery('users', (q) => q.teen())
  const usersOrderedById = v1.collectionQuery('users', (q) => q.orderById())
  const user = users.doc('user')

  const posts = user.collection('posts')
  const post = posts.doc('post')

  const usersGroup = typedFirestore.collectionGroup('users', 'versions.users')
  const teenUsersGroup = typedFirestore.collectionGroupQuery(
    'users',
    'versions.users',
    (q) => q.teen(),
  )

  return {
    typedFirestore,
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
  }
}

type UserU = IUserLocal &
  STypes.DocumentMeta<F> &
  STypes.HasLoc<'versions.users'> &
  STypes.HasT<IUser> &
  STypes.HasId

type PostU = (IPostA | IPostB) &
  STypes.DocumentMeta<F> &
  STypes.HasLoc<'versions.users.posts'> &
  STypes.HasT<IPostA | IPostB> &
  STypes.HasId

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
})

for (const env of ['web', 'admin'] as const) {
  const $env = (str: string) => `[${env}] ${str}`

  const app =
    env === 'web'
      ? ((authedApp('user') as any).firestore() as Firestore)
      : getFirestoreAdmin(authedAdminApp('user'))
  const appUnauthed =
    env === 'web'
      ? ((authedApp('unauthed') as any).firestore() as Firestore)
      : getFirestoreAdmin(authedAdminApp('unauthed'))

  const r = _tcollections(app, env)
  const ur = _tcollections(appUnauthed, env)
  const firestoreStatic = r.typedFirestore.firestoreStatic

  const expectAnyTimestamp =
    env === 'web' ? expectAnyTimestampWeb : expectAnyTimestampAdmin

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
            queryUniv(r.users.raw, (q) => [
              q.where('age', '>=', 10),
              q.where('age', '<', 20),
            ]),
            r.teenUsers.raw,
          ),
        ).toBe(true)

        expect(
          queryEqualUniv(
            queryUniv(r.usersGroup.raw, (q) => [
              q.where('age', '>=', 10),
              q.where('age', '<', 20),
            ]),
            r.teenUsersGroup.raw,
          ),
        ).toBe(true)

        expect(
          queryEqualUniv(
            queryUniv(r.users.raw, (q) => [
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

  const userData = createUserData(firestoreStatic)

  const usersRaw = collectionUniv(
    docUniv(collectionUniv(app, 'versions'), 'v1'),
    'users',
  )

  const createInitialUserAndPost = async () => {
    const meta = {
      [_createdAt]: firestoreStatic.serverTimestamp(),
      [_updatedAt]: firestoreStatic.serverTimestamp(),
    }

    const userRef = docUniv(usersRaw, 'user')
    await setDocUniv(userRef, { ...userData, ...meta } as any)

    const postRef = docUniv(collectionUniv(userRef, 'posts'), 'post')
    await setDocUniv(postRef, { ...postAData, ...meta } as any)
  }

  const transformer = withRefTransformer

  describe($env('read'), () => {
    beforeEach(createInitialUserAndPost)

    test.each([
      {
        get: () => r.typedFirestore.runTransaction((tt) => tt.get(r.user)),
        getData: typeExtends<
          TypedDocumentRef<S, F, 'versions.users'>['getData']
        >()((options) =>
          r.typedFirestore.runTransaction((tt) => tt.getData(r.user, options)),
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
          ...userData,
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
        get: () => r.typedFirestore.runTransaction((tt) => tt.get(r.post)),
        getData: typeExtends<
          TypedDocumentRef<S, F, 'versions.users.posts'>['getData']
        >()((options) =>
          r.typedFirestore.runTransaction((tt) => tt.getData(r.post, options)),
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
            ...userData,
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
            ...userData,
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
        await assertSucceeds(r.user.create({ ...userData, tags: [] }))
      })

      test('create user (fails due to invalid timestamp)', async () => {
        const serverTs = () => firestoreStatic.serverTimestamp()
        const localTs = () => firestoreStatic.Timestamp.fromDate(new Date())

        for (const data of [
          { ...userData, [_createdAt]: serverTs() },
          { ...userData, [_updatedAt]: serverTs() },
          { ...userData, [_createdAt]: localTs(), [_updatedAt]: serverTs() },
          { ...userData, [_createdAt]: serverTs(), [_updatedAt]: localTs() },
        ]) {
          await assertFails(setDocUniv(r.user.raw, data as any))
        }

        await assertSucceeds(
          setDocUniv(r.user.raw, {
            ...userData,
            [_createdAt]: serverTs(),
            [_updatedAt]: serverTs(),
          } as any),
        )

        for (const data of [
          { [_createdAt]: serverTs() },
          { [_createdAt]: serverTs(), [_updatedAt]: serverTs() },
          { [_updatedAt]: localTs() },
        ]) {
          await assertFails(updateDocUniv(r.user.raw, data as any))
        }

        await assertSucceeds(
          updateDocUniv(r.user.raw, {
            [_updatedAt]: serverTs(),
          } as any),
        )
      })

      test('create user (fails due to wrong type)', async () => {
        await assertFails(
          r.user.create({
            ...userData,
            // @ts-expect-error: tags.id
            tags: [{ id: '0', name: 'tag0' }],
          }),
        )

        await assertFails(
          r.user.create({
            ...userData,
            // @ts-expect-error: options.a
            options: { a: 1, b: 'value' },
          }),
        )
      })

      test('create user (fails due to unauthed)', async () => {
        await assertFails(ur.user.create(userData))
      })

      describe('write to non-existing doc', () => {
        test('setMerge fails', async () => {
          await assertFails(r.user.setMerge(userData))
        })

        test('update fails', async () => {
          await assertFails(r.user.update(userData))
        })
      })

      test('overwrite user fails', async () => {
        await r.user.create(userData)
        await assertSucceeds(r.user.update(userData))
        await assertFails(r.user.create(userData))
      })
    })

  describe($env('write'), () => {
    test.each([
      async () => {
        await r.user.create(userData)
        // @ts-expect-error: wrong data type
        void (() => r.user.create(postData))
      },
      async () => {
        const b = r.typedFirestore.batch()
        b.create(r.user, userData)
        // @ts-expect-error: wrong data type
        void (() => b.create(r.user, postAData))
        await b.commit()
      },
      async () => {
        await r.typedFirestore.runTransaction(async (tt) => {
          tt.create(r.user, userData)
          // @ts-expect-error: wrong data type
          void (() => tt.create(r.user, postAData))
        })
      },
    ])('create user %#', async (fn) => {
      await fn()

      const snapRaw = await getDocUniv(docUniv(usersRaw, 'user'), undefined)
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expectAnyTimestamp(),
        _updatedAt: expectAnyTimestamp(),
        timestamp: expectAnyTimestamp(),
      })
    })
  })

  describe($env('write (with initial docs)'), () => {
    beforeEach(createInitialUserAndPost)

    const userUpdateData = {
      name: 'name1-updated',
      tags: firestoreStatic.arrayUnion({ id: 2, name: 'tag2' }),
    }
    for (const op of ['setMerge', 'update'] as const) {
      test.each([
        async () => {
          await r.user[op](userUpdateData)
          // @ts-expect-error: wrong data type
          void (() => r.user[op](postAData))
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

        const snapRaw = await getDocUniv(docUniv(usersRaw, 'user'), undefined)
        expect(snapRaw.data()).toMatchObject({
          ...userData,
          name: 'name1-updated',
          tags: [...userData.tags, { id: 2, name: 'tag2' }],
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

        const snapRaw = await getDocUniv(docUniv(usersRaw, 'user'), undefined)
        expect(snapRaw.data()).toMatchObject({
          ...userData,
          age: userData.age + 1,
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

      const snapRaw = await getDocUniv(docUniv(usersRaw, 'user'), undefined)
      expect(existsUniv(snapRaw)).toBeFalsy()
    })
  })

  env === 'web' &&
    describe($env('hooks'), () => {
      beforeEach(createInitialUserAndPost)

      const initialResult = {
        error: undefined,
        loading: true,
        data: undefined,
        snap: undefined,
      }

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
            () => useTypedDocument(ref),
          )
          await waitForNextUpdate()

          expect(result.current).toMatchObject({
            error: undefined,
            loading: false,
            snap: expect.any(TypedDocumentSnap),
          })

          const consoleMock = jest.spyOn(console, 'error').mockImplementation()
          for (const _ of R.range(0, 3)) {
            updateRef()
            rerender()
            await sleep(500)
          }
          consoleMock.mockRestore()

          expect(result.current).toMatchObject({
            error: undefined,
            loading: false,
            snap: undefined,
            data: undefined,
          })

          unmount()
        })

        test.each([useTypedDocument, useTypedDocumentOnce])(
          'without transformer %#',
          async (hook) => {
            const { result, waitForNextUpdate, unmount } = renderHook(() =>
              hook(r.user),
            )
            expect(result.current).toEqual(initialResult)
            await waitForNextUpdate()

            expect(result.current).toMatchObject({
              error: undefined,
              loading: false,
              snap: expect.any(TypedDocumentSnap),
              data: { ...userData, timestamp: expect.any(String) },
            })
            expect(
              refEqualUniv(result.current.snap!.typedRef.raw, r.user.raw),
            ).toBe(true)

            expectType<UserU>(result.current.data!)
            // @ts-expect-error: wrong data type
            expectType<PostU>(result.current.data!)
            unmount()
          },
        )

        test.each([useTypedDocument, useTypedDocumentOnce])(
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
            expect(result.current).toEqual(initialResult)
            await waitForNextUpdate()

            expect(result.current).toMatchObject({
              error: undefined,
              loading: false,
              snap: expect.any(TypedDocumentSnap),
              data: userData.name,
            })
            expect(
              refEqualUniv(result.current.snap!.typedRef.raw, r.user.raw),
            ).toBe(true)

            expectType<string>(result.current.data!)
            // @ts-expect-error: wrong data type
            expectType<number>(result.current.data!)
            unmount()
          },
        )
      })

      describe('useTypedQuery', () => {
        test('safeRef', async () => {
          let ref: any
          const updateRef = () => {
            ref = r.v1.collectionQuery('users', (q) => q._teen())
          }
          updateRef()

          const { result, rerender, waitForNextUpdate, unmount } = renderHook(
            () => useTypedQuery(ref),
          )
          await waitForNextUpdate()

          expect(result.current).toMatchObject({
            error: undefined,
            loading: false,
            snap: expect.any(TypedQuerySnap),
          })

          const consoleMock = jest.spyOn(console, 'error').mockImplementation()
          for (const _ of R.range(0, 3)) {
            updateRef()
            rerender()
            await sleep(500)
          }
          consoleMock.mockRestore()

          expect(result.current).toMatchObject({
            error: undefined,
            loading: false,
            snap: undefined,
            data: undefined,
          })

          unmount()
        })

        test.each([useTypedQuery, useTypedQueryOnce])(
          'without transformer %#',
          async (hook) => {
            const { result, waitForNextUpdate, unmount } = renderHook(() =>
              hook(r.teenUsers),
            )
            expect(result.current).toEqual(initialResult)
            await waitForNextUpdate()

            expect(result.current).toMatchObject({
              error: undefined,
              loading: false,
              snap: expect.any(TypedQuerySnap),
              data: [{ ...userData, timestamp: expect.any(String) }],
            })
            expect(
              refEqualUniv(
                result.current.snap!.typedDocs[0]!.typedRef.raw,
                r.user.raw,
              ),
            ).toBe(true)

            expectType<UserU>(result.current.data![0]!)
            // @ts-expect-error: wrong data type
            expectType<PostU>(result.current.data![0]!)
            unmount()
          },
        )

        test.each([useTypedQuery, useTypedQueryOnce])(
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
            expect(result.current).toEqual(initialResult)
            await waitForNextUpdate()

            expect(result.current).toMatchObject({
              error: undefined,
              loading: false,
              snap: expect.any(TypedQuerySnap),
              data: [userData.name],
            })
            expect(
              refEqualUniv(
                result.current.snap!.typedDocs[0]!.typedRef.raw,
                r.user.raw,
              ),
            ).toBe(true)

            expectType<string>(result.current.data![0]!)
            // @ts-expect-error: wrong data type
            expectType<number>(result.current.data![0]!)
            unmount()
          },
        )
      })
    })
}
