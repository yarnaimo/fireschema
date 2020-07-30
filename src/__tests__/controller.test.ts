import { assertFails } from '@firebase/testing'
import { expectType } from 'tsd'
import { IUser } from './_fixtures/schema'
import { collections } from './_infrastructure/firestore'
import { store, unauthedStore } from './_infrastructure/store'
import { expectEqualRef } from './_utils/firestore'

const r = collections(store)
const ur = collections(unauthedStore)

describe('refs', () => {
  test('collection', () => {
    expectEqualRef(
      store.app
        .collection('versions')
        .doc('v1')
        .collection('users')
        .doc('user'),
      r.user,
    )
  })

  test('query', () => {
    expectEqualRef(
      store.app
        .collection('versions')
        .doc('v1')
        .collection('users')
        .where('age', '>=', 10)
        .where('age', '<', 20),
      r.users.select.teen(),
    )

    expectEqualRef(
      store.app
        .collectionGroup('users')
        .where('age', '>=', 10)
        .where('age', '<', 20),
      r.usersGroup.select.teen(),
    )
  })
})

const userData = {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: store.FieldValue.serverTimestamp(),
  tags: ['tag0', 'tag1'],
}

const usersRaw = store.app.collection('versions').doc('v1').collection('users')

describe('read', () => {
  beforeEach(async () => {
    await usersRaw.doc('user').set(userData as any)
  })

  test('get', async () => {
    const snap = await r.user.get()
    const data = snap.data()!

    expectType<IUser>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.any(store.Timestamp),
    })
  })

  test('get collectionGroup', async () => {
    const snap = await r.usersGroup.select.teen().get()

    expect(snap.docs).toHaveLength(1)
    const data = snap.docs[0].data()

    expectType<IUser>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.any(store.Timestamp),
    })
  })
})

describe('write', () => {
  describe('create', () => {
    test('normal', async () => {
      await store.create(r.user, userData)

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any(store.Timestamp),
        _updatedAt: expect.any(store.Timestamp),
        timestamp: expect.any(store.Timestamp),
      })
    })

    test('normal (unauthed, fails)', async () => {
      await assertFails(unauthedStore.create(ur.user, userData))
    })

    test('transaction', async () => {
      await store.app.runTransaction(async ($) => {
        store.$create($, r.user, userData)
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any(store.Timestamp),
        _updatedAt: expect.any(store.Timestamp),
        timestamp: expect.any(store.Timestamp),
      })
    })
  })

  describe('setMerge', () => {
    beforeEach(async () => {
      await usersRaw.doc('user').set(userData as any)
    })

    test('normal', async () => {
      await store.setMerge(r.user, {
        name: 'umi-kousaka',
        tags: store.FieldValue.arrayUnion('tag2'),
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        name: 'umi-kousaka',
        tags: ['tag0', 'tag1', 'tag2'],
        _updatedAt: expect.any(store.Timestamp),
        timestamp: expect.any(store.Timestamp),
      })
    })

    test('transaction', async () => {
      await store.app.runTransaction(async ($) => {
        const tsnap = await $.get(r.user)

        store.$setMerge($, r.user, {
          age: tsnap.data()!.age + 1,
        })
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        age: userData.age + 1,
        _updatedAt: expect.any(store.Timestamp),
        timestamp: expect.any(store.Timestamp),
      })
    })
  })
})
