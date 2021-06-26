import {
  assertFails,
  assertSucceeds,
  firestore,
} from '@firebase/rules-unit-testing'
import { renderHook } from '@testing-library/react-hooks'
import { expectType } from 'tsd'
import {
  FTypes,
  STypes,
  TypedDocumentSnap,
  TypedFirestore,
  TypedQueryDocumentSnap,
} from '../../core'
import { useTypedDocument, useTypedQuery } from '../../hooks'
import { _web } from '../../lib/firestore-types'
import { postAData, userData } from '../_fixtures/data'
import {
  firestoreSchema,
  IPostA,
  IPostB,
  IUser,
  IUserLocal,
  PostSchema,
  UserSchema,
} from '../_fixtures/firestore-schema'
import { authedApp } from '../_infrastructure/_app'
import { expectAnyTimestamp, expectEqualRef } from '../_utils/firestore'

const _tcollections = (app: _web.Firestore) => {
  const typedFirestore = new TypedFirestore(firestoreSchema, firestore, app)

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

const app = authedApp('user').firestore()
const appUnauthed = authedApp('unauthed').firestore()

const r = _tcollections(app)
const ur = _tcollections(appUnauthed)

type UserU = IUserLocal &
  STypes.DocumentMeta<_web.Firestore> &
  STypes.HasLoc<'versions.users'> &
  STypes.HasT<IUser> &
  STypes.HasId

type PostU = (IPostA | IPostB) &
  STypes.DocumentMeta<_web.Firestore> &
  STypes.HasLoc<'versions.users.posts'> &
  STypes.HasT<IPostA | IPostB> &
  STypes.HasId

describe('types', () => {
  test('decoder', () => {
    expectType<
      (data: IUser, snap: FTypes.QueryDocumentSnap<IUser>) => IUserLocal
    >(UserSchema.decoder)

    expectType<undefined>(PostSchema.decoder)
  })

  test('UAt', () => {
    expectType<UserU>(
      {} as STypes.DocDataAt<
        typeof firestoreSchema,
        _web.Firestore,
        'versions.users'
      >,
    )
    expectType<PostU>(
      // @ts-expect-error: wrong U type
      {} as STypes.DocDataAt<
        typeof firestoreSchema,
        _web.Firestore,
        'versions.users'
      >,
    )
  })
})

describe('refs', () => {
  test('ref equality', () => {
    expectEqualRef(r.users.raw, app.collection('versions/v1/users'), false)
    expectEqualRef(r.user.raw, app.doc('versions/v1/users/user'), false)

    expectEqualRef(r.users.raw, r.v1.collection('users').raw)
    expectEqualRef(r.user.raw, r.v1.collection('users').doc('user').raw)
  })

  test('query equality', () => {
    expectEqualRef(
      r.users.raw.where('age', '>=', 10).where('age', '<', 20),
      r.teenUsers.raw,
    )

    expectEqualRef(
      r.usersGroup.raw.where('age', '>=', 10).where('age', '<', 20),
      r.teenUsersGroup.raw,
    )

    expectEqualRef(
      r.users.raw.orderBy(firestore.FieldPath.documentId()),
      r.usersOrderedById.raw,
    )
  })

  test('doc() argument', () => {
    const a = r.users.doc()
    const b = r.users.doc(undefined)
    expect(a.id).toHaveLength(20)
    expect(b.id).toHaveLength(20)
  })
})

describe('class structure', () => {
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
      expect(instance.loc).toEqual(l)
      expectEqualRef(instance.raw, firstInstance.raw)
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
      expect(instance.loc).toEqual(l)
    }
  })
})

const usersRaw = app.collection('versions').doc('v1').collection('users')

const createInitialUserAndPost = async () => {
  await usersRaw.doc('user').set(userData as any)

  await usersRaw
    .doc('user')
    .collection('posts')
    .doc('post')
    .set(postAData as any)
}

describe('read', () => {
  beforeEach(createInitialUserAndPost)

  test.each([
    {
      get: () => r.typedFirestore.runTransaction((tt) => tt.get(r.user)),
      getData: () =>
        r.typedFirestore.runTransaction((tt) => tt.getData(r.user)),
    },
    r.user,
    r.posts.parentDocument(),
    r.typedFirestore.wrapDocument(r.user.raw),
  ])('get doc - user %#', async (ref) => {
    const snap = await ref.get()
    const snapData = await ref.getData()

    for (const data of [snap.data()!, snapData!]) {
      expectType<UserU>(data)
      // @ts-expect-error: wrong data type
      expectType<PostU>(data)
      expect(data).toMatchObject({
        ...userData,
        timestamp: expect.any(String),
        id: snap.id,
      })
    }
  })

  test.each([
    {
      get: () => r.typedFirestore.runTransaction((tt) => tt.get(r.post)),
      getData: () =>
        r.typedFirestore.runTransaction((tt) => tt.getData(r.post)),
    },
    r.post,
    r.typedFirestore.wrapDocument(r.post.raw),
  ])('get doc - post %#', async (ref) => {
    const snap = await ref.get()
    const snapData = await ref.getData()

    for (const data of [snap.data()!, snapData!]) {
      expectType<PostU>(data)
      // @ts-expect-error: wrong data type
      expectType<UserU>(data)
      expect(data).toMatchObject({
        ...postAData,
        id: snap.id,
      })
    }
  })

  test.each([r.users, r.user.parentCollection()])(
    'get collection - users %#',
    async (ref) => {
      const snap = await ref.get()
      const snapData = await ref.getData()

      expect(snap.typedDocs).toHaveLength(1)
      expect(snapData).toHaveLength(1)

      for (const data of [snap.typedDocs[0]!.data(), snapData[0]!]) {
        expectType<UserU>(data)
        // @ts-expect-error: wrong data type
        expectType<PostU>(data)
        expect(data).toMatchObject({
          ...userData,
          timestamp: expect.any(String),
          id: snap.typedDocs[0].id,
        })
      }
    },
  )

  test.each([r.teenUsers, r.teenUsersGroup])(
    'get query - users %#',
    async (query) => {
      const snap = await query.get()
      const snapData = await query.getData()

      expect(snap.typedDocs).toHaveLength(1)
      expect(snapData).toHaveLength(1)

      for (const data of [snap.typedDocs[0]!.data(), snapData[0]!]) {
        expectType<UserU>(data)
        // @ts-expect-error: wrong data type
        expectType<PostU>(data)
        expect(data).toMatchObject({
          ...userData,
          timestamp: expect.any(String),
          id: snap.typedDocs[0].id,
        })
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
      getData: async () => {
        const usersSnap = await r.users.get()
        const userRef = usersSnap.typedDocs[0]!.typedRef
        return userRef.collection('posts').getData()
      },
    },
    r.posts,
    r.post.parentCollection(),
  ])('get collection - posts %#', async (ref) => {
    const snap = await ref.get()
    const snapData = await ref.getData()

    expect(snap.typedDocs).toHaveLength(1)
    expect(snapData).toHaveLength(1)

    for (const data of [snap.typedDocs[0]!.data(), snapData[0]!]) {
      expectType<PostU>(data)
      // @ts-expect-error: wrong data type
      expectType<UserU>(data)
      expect(data).toMatchObject({
        ...postAData,
        id: snap.typedDocs[0].id,
      })
    }
  })
})

describe('write', () => {
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

    const snapRaw = await usersRaw.doc('user').get()
    expect(snapRaw.data()).toMatchObject({
      ...userData,
      _createdAt: expectAnyTimestamp(),
      _updatedAt: expectAnyTimestamp(),
      timestamp: expectAnyTimestamp(),
    })
  })

  test('create user (empty array)', async () => {
    await assertSucceeds(r.user.create({ ...userData, tags: [] }))
  })

  test('create user (fails due to invalid timestamp)', async () => {
    await assertSucceeds(
      r.user.raw.set({
        ...userData,
        _createdAt: firestore.FieldValue.serverTimestamp(),
        _updatedAt: firestore.FieldValue.serverTimestamp(),
      } as any),
    )
    await assertSucceeds(
      r.user.raw.set({
        ...userData,
        _createdAt: firestore.FieldValue.serverTimestamp(),
      } as any),
    )
    await assertFails(
      r.user.raw.set({
        ...userData,
        _createdAt: firestore.FieldValue.serverTimestamp(),
        _updatedAt: firestore.Timestamp.fromDate(new Date()),
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
    test('setMerge succeeds', async () => {
      await expect(r.user.setMerge(userData)).resolves.toBeUndefined()
    })

    test('update fails', async () => {
      await expect(r.user.update(userData)).rejects.toThrowError()
    })
  })
})

describe('write (with existing doc)', () => {
  beforeEach(createInitialUserAndPost)

  const userUpdateData = {
    name: 'name1-updated',
    tags: firestore.FieldValue.arrayUnion({ id: 2, name: 'tag2' }),
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

      const snapRaw = await usersRaw.doc('user').get()
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

      const snapRaw = await usersRaw.doc('user').get()
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

    const snapRaw = await usersRaw.doc('user').get()
    expect(snapRaw.exists).toBeFalsy()
  })
})

describe('hooks', () => {
  beforeEach(createInitialUserAndPost)

  const initialResult = {
    error: undefined,
    loading: true,
    data: undefined,
    snap: undefined,
  }

  test('useTypedDocument', async () => {
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useTypedDocument(r.user),
    )
    expect(result.current).toEqual(initialResult)
    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      error: undefined,
      loading: false,
      data: { ...userData, timestamp: expect.any(String) },
    })
    expectEqualRef(result.current.snap!.typedRef.raw, r.user.raw)

    expectType<UserU>(result.current.data!)
    // @ts-expect-error: wrong data type
    expectType<PostU>(result.current.data!)
    unmount()
  })

  test('useTypedDocument with transformer', async () => {
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useTypedDocument(r.user, (data, snap) => {
        expectType<
          TypedDocumentSnap<
            typeof firestoreSchema,
            _web.Firestore,
            'versions.users'
          >
        >(snap)
        return data.name
      }),
    )
    expect(result.current).toEqual(initialResult)
    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      error: undefined,
      loading: false,
      data: userData.name,
    })
    expectEqualRef(result.current.snap!.typedRef.raw, r.user.raw)

    expectType<string>(result.current.data!)
    // @ts-expect-error: wrong data type
    expectType<number>(result.current.data!)
    unmount()
  })

  test('useTypedQuery', async () => {
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useTypedQuery(r.users),
    )
    expect(result.current).toEqual(initialResult)
    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      error: undefined,
      loading: false,
      data: [{ ...userData, timestamp: expect.any(String) }],
    })
    expectEqualRef(result.current.snap!.typedDocs[0]!.typedRef.raw, r.user.raw)

    expectType<UserU>(result.current.data![0]!)
    // @ts-expect-error: wrong data type
    expectType<PostU>(result.current.data![0]!)
    unmount()
  })

  test('useTypedQuery with transformer', async () => {
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useTypedQuery(r.users, (data, snap) => {
        expectType<
          TypedQueryDocumentSnap<
            typeof firestoreSchema,
            _web.Firestore,
            'versions.users'
          >
        >(snap)
        return data.name
      }),
    )
    expect(result.current).toEqual(initialResult)
    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      error: undefined,
      loading: false,
      data: [userData.name],
    })
    expectEqualRef(result.current.snap!.typedDocs[0]!.typedRef.raw, r.user.raw)

    expectType<string>(result.current.data![0]!)
    // @ts-expect-error: wrong data type
    expectType<number>(result.current.data![0]!)
    unmount()
  })
})
