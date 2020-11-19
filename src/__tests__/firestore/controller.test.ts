import { assertFails, assertSucceeds, firestore } from '@firebase/testing'
import { isDayjs } from 'dayjs'
import { expectType } from 'tsd'
import {
  createFirestoreRefAdapter,
  createFirestoreWriteAdapter,
  FirestoreRefAdapter,
  STypes,
} from '../..'
import { fadmin, fweb } from '../../types/_firestore'
import { userData } from '../_fixtures/data'
import {
  firestoreSchema,
  IPostA,
  IPostB,
  IUser,
  IUserLocal,
} from '../_fixtures/firestore-schema'
import { authedApp } from '../_infrastructure/_app'
import { expectEqualRef } from '../_utils/firestore'

export const $: FirestoreRefAdapter<typeof firestoreSchema> = createFirestoreRefAdapter(
  firestoreSchema,
)

const _collections = (app: fweb.Firestore) => {
  const versions = $.collection(app, 'versions')
  const v1 = versions.doc('v1')

  const users = $.collection(v1, 'users')
  const teenUsers = $.collectionQuery(v1, 'users', (q) => q.teen())
  const user = users.doc('user')

  const posts = $.collection(user, 'posts')
  const post = posts.doc('post')

  const usersGroup = $.collectionGroup(app, 'versions/v1/users')
  const teenUsersGroup = $.collectionGroupQuery(app, 'versions/v1/users', (q) =>
    q.teen(),
  )

  return {
    versions,
    v1,
    users,
    user,
    teenUsers,
    posts,
    post,
    usersGroup,
    teenUsersGroup,
  }
}

const app = authedApp('user').firestore()
const appUnauthed = authedApp('unauthed').firestore()

const $web = createFirestoreWriteAdapter(firestore, app)
const $webUnauthed = createFirestoreWriteAdapter(firestore, appUnauthed)

const r = _collections(app)
const ur = _collections(appUnauthed)

type UserU = IUserLocal &
  STypes.DocumentMeta<fadmin.Firestore> &
  STypes.HasLoc<['versions', 'users']> &
  STypes.HasT<IUser>

type PostU = (IPostA | IPostB) &
  STypes.DocumentMeta<fadmin.Firestore> &
  STypes.HasLoc<['versions', 'users', 'posts']> &
  STypes.HasT<IPostA | IPostB>

describe('types', () => {
  test('UAt', () => {
    expectType<typeof r.user>(
      {} as fweb.DocumentReference<
        STypes.UAt<typeof firestoreSchema, fweb.Firestore, 'versions/v1/users'>
      >,
    )
    expectType<
      fweb.DocumentReference<
        STypes.UAt<typeof firestoreSchema, fweb.Firestore, 'versions/v1/users'>
      >
    >(r.user)

    expectType<typeof r.post>(
      {} as fweb.DocumentReference<
        STypes.UAt<
          typeof firestoreSchema,
          fweb.Firestore,
          'versions/v1/users/{uid}/posts'
        >
      >,
    )
  })
})

describe('refs equality', () => {
  test('collection', () => {
    expectEqualRef(r.users, app.collection('versions/v1/users'), false)
    expectEqualRef(r.user, app.doc('versions/v1/users/user'), false)

    expectEqualRef(r.users, $.collection(r.v1, 'users'))
    expectEqualRef(r.user, $.collection(r.v1, 'users').doc('user'))
  })

  test('query', () => {
    expectEqualRef(
      r.users.where('age', '>=', 10).where('age', '<', 20),
      r.teenUsers,
    )

    expectEqualRef(
      r.usersGroup.where('age', '>=', 10).where('age', '<', 20),
      r.teenUsersGroup,
    )
  })

  test('typeDocument', () => {
    const path = 'versions/v1/users/user/posts/post'
    const actualPostRef = $.typeDocument(
      'versions/v1/users/{uid}/posts',
      app.doc(path),
    )

    expectType<firebase.firestore.DocumentReference<PostU>>(actualPostRef)

    expectType<
      firebase.firestore.DocumentReference<
        IUser & { __loc__: ['versions', 'users', 'posts'] }
      >
      // @ts-expect-error: doc data
    >(actualPostRef)

    expect(actualPostRef.path).toBe(path)
    expectEqualRef(actualPostRef, r.post)
  })

  test('getParentDocument', () => {
    const user = $.getParentDocument(r.posts)

    expectType<firebase.firestore.DocumentReference<UserU>>(user)
    expect(user.path).toBe(r.user.path)

    // @ts-expect-error post
    expectType<firebase.firestore.DocumentReference<PostU>>(user)
  })
})

const usersRaw = app.collection('versions').doc('v1').collection('users')

describe('read', () => {
  beforeEach(async () => {
    await usersRaw.doc('user').set(userData as any)
  })

  test('get', async () => {
    const snap = await r.user.get()
    const data = snap.data()! // eslint-disable-line @typescript-eslint/no-non-null-assertion

    expectType<UserU>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.anything(),
    })
    expect(isDayjs(data.timestamp)).toBeTruthy()
  })

  test('get collectionGroup', async () => {
    const snap = await r.teenUsersGroup.get()

    expect(snap.docs).toHaveLength(1)
    const data = snap.docs[0].data()

    expectType<UserU>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.anything(),
    })
    expect(isDayjs(data.timestamp)).toBeTruthy()
  })
})

describe('write', () => {
  describe('create', () => {
    test('normal', async () => {
      await $web.create(r.user, userData)

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any(firestore.Timestamp),
        _updatedAt: expect.any(firestore.Timestamp),
        timestamp: expect.any(firestore.Timestamp),
      })
    })

    test('normal (empty array)', async () => {
      await assertSucceeds($web.create(r.user, { ...userData, tags: [] }))
    })

    test('normal (fails due to wrong type)', async () => {
      await assertFails(
        $web.create(r.user, {
          ...userData,
          // @ts-expect-error: tags.id
          tags: [{ id: '0', name: 'tag0' }],
        }),
      )

      await assertFails(
        $web.create(r.user, {
          ...userData,
          // @ts-expect-error: options.a
          options: { a: 1, b: 'value' },
        }),
      )
    })

    test('normal (fails due to unauthed)', async () => {
      await assertFails($webUnauthed.create(ur.user, userData))
    })

    test('transaction', async () => {
      await $web.runTransaction(async (tc) => {
        tc.create(r.user, userData)
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any(firestore.Timestamp),
        _updatedAt: expect.any(firestore.Timestamp),
        timestamp: expect.any(firestore.Timestamp),
      })
    })
  })

  describe('write to non-existing doc', () => {
    test('setMerge succeeds', async () => {
      await expect($web.setMerge(r.user, userData)).resolves.toBeUndefined()
    })

    test('update fails', async () => {
      await expect($web.update(r.user, userData)).rejects.toThrowError()
    })
  })

  for (const op of ['setMerge', 'update'] as const) {
    describe(op, () => {
      beforeEach(async () => {
        await usersRaw.doc('user').set(userData as any)
      })

      test('normal', async () => {
        await $web[op](r.user, {
          name: 'umi-kousaka',
          tags: firestore.FieldValue.arrayUnion({ id: 2, name: 'tag2' }),
        })

        const snapRaw = await usersRaw.doc('user').get()
        expect(snapRaw.data()).toMatchObject({
          ...userData,
          name: 'umi-kousaka',
          tags: [...userData.tags, { id: 2, name: 'tag2' }],
          _updatedAt: expect.any(firestore.Timestamp),
          timestamp: expect.any(firestore.Timestamp),
        })
      })

      test('transaction', async () => {
        await $web.runTransaction(async (tc) => {
          const tsnap = await tc.get(r.user)

          tc[op](r.user, {
            age: tsnap.data()!.age + 1, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          })
        })

        const snapRaw = await usersRaw.doc('user').get()
        expect(snapRaw.data()).toMatchObject({
          ...userData,
          age: userData.age + 1,
          _updatedAt: expect.any(firestore.Timestamp),
          timestamp: expect.any(firestore.Timestamp),
        })
      })
    })
  }
})
