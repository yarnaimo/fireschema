import { assertFails, assertSucceeds } from '@firebase/testing'
import { expectType } from 'tsd'
import { STypes } from '../..'
import { fadmin } from '../../types/_firestore'
import { IUser } from '../_fixtures/firestore-schema'
import { collections } from '../_infrastructure/firestore'
import { $web, $webUnauthed } from '../_infrastructure/firestore-controller'
import { expectEqualRef } from '../_utils/firestore'

const r = collections($web)
const ur = collections($webUnauthed)

describe('refs', () => {
  test('collection', () => {
    expectEqualRef(
      $web.app.collection('versions').doc('v1').collection('users').doc('user'),
      r.user,
    )
  })

  test('query', () => {
    expectEqualRef(
      $web.app
        .collection('versions')
        .doc('v1')
        .collection('users')
        .where('age', '>=', 10)
        .where('age', '<', 20),
      r.users.select.teen(),
    )

    expectEqualRef(
      $web.app
        .collectionGroup('users')
        .where('age', '>=', 10)
        .where('age', '<', 20),
      r.usersGroup.select.teen(),
    )
  })

  test('parentOfCollection', () => {
    const user = $web.parentOfCollection(r.posts.ref)

    expectType<
      firebase.firestore.DocumentReference<
        IUser & { __loc__: ['versions', 'users'] }
      >
    >(user)
    expectEqualRef(user, r.user)
  })
})

const userData = {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: $web.FieldValue.serverTimestamp(),
  tags: [
    { id: 0, name: 'tag0' },
    { id: 1, name: 'tag1' },
  ],
  options: { a: true, b: 'value' },
}

const usersRaw = $web.app.collection('versions').doc('v1').collection('users')

describe('read', () => {
  beforeEach(async () => {
    await usersRaw.doc('user').set(userData as any)
  })

  test('get', async () => {
    const snap = await r.user.get()
    const data = snap.data()!

    expectType<IUser & STypes.DocumentMeta<fadmin.Firestore>>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.any($web.Timestamp),
    })
  })

  test('get collectionGroup', async () => {
    const snap = await r.usersGroup.select.teen().get()

    expect(snap.docs).toHaveLength(1)
    const data = snap.docs[0].data()

    expectType<
      IUser &
        STypes.DocumentMeta<fadmin.Firestore> &
        STypes.HasLoc<['versions', 'users']>
    >(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.any($web.Timestamp),
    })
  })
})

describe('write', () => {
  describe('create', () => {
    test('normal', async () => {
      await $web.create(r.user, userData)

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any($web.Timestamp),
        _updatedAt: expect.any($web.Timestamp),
        timestamp: expect.any($web.Timestamp),
      })
    })

    test('normal (empty array)', async () => {
      await assertSucceeds($web.create(r.user, { ...userData, tags: [] }))
    })

    test('normal (fails due to wrong type)', async () => {
      await assertFails(
        $web.create(r.user, {
          ...userData,
          // @ts-expect-error
          tags: [{ id: '0', name: 'tag0' }],
        }),
      )

      await assertFails(
        $web.create(r.user, {
          ...userData,
          // @ts-expect-error
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
        _createdAt: expect.any($web.Timestamp),
        _updatedAt: expect.any($web.Timestamp),
        timestamp: expect.any($web.Timestamp),
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
          tags: $web.FieldValue.arrayUnion({ id: 2, name: 'tag2' }),
        })

        const snapRaw = await usersRaw.doc('user').get()
        expect(snapRaw.data()).toMatchObject({
          ...userData,
          name: 'umi-kousaka',
          tags: [...userData.tags, { id: 2, name: 'tag2' }],
          _updatedAt: expect.any($web.Timestamp),
          timestamp: expect.any($web.Timestamp),
        })
      })

      test('transaction', async () => {
        await $web.runTransaction(async (tc) => {
          const tsnap = await tc.get(r.user)

          tc[op](r.user, {
            age: tsnap.data()!.age + 1,
          })
        })

        const snapRaw = await usersRaw.doc('user').get()
        expect(snapRaw.data()).toMatchObject({
          ...userData,
          age: userData.age + 1,
          _updatedAt: expect.any($web.Timestamp),
          timestamp: expect.any($web.Timestamp),
        })
      })
    })
  }
})
