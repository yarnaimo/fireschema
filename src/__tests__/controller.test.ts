import { expectType } from 'tsd'
import { IUser } from './fixtures/schema'
import { user, users, usersGroup } from './infrastructure/collections'
import { storeAdmin } from './infrastructure/firestore'
import { expectEqualRef } from './utils/firestore'

describe('refs', () => {
  test('collection', () => {
    expectEqualRef(
      storeAdmin.app
        .collection('versions')
        .doc('v1')
        .collection('users')
        .doc('user'),
      user,
    )
  })

  test('query', () => {
    expectEqualRef(
      storeAdmin.app
        .collection('versions')
        .doc('v1')
        .collection('users')
        .where('age', '>=', 10)
        .where('age', '<', 20),
      users.select.teen(),
    )

    expectEqualRef(
      storeAdmin.app
        .collectionGroup('users')
        .where('age', '>=', 10)
        .where('age', '<', 20),
      usersGroup.select.teen(),
    )
  })
})

const userData = {
  name: 'umi',
  displayName: null,
  age: 16,
  timestamp: storeAdmin.FieldValue.serverTimestamp(),
  tags: ['tag0', 'tag1'],
}

const usersRaw = storeAdmin.app
  .collection('versions')
  .doc('v1')
  .collection('users')

describe('read', () => {
  beforeEach(async () => {
    await usersRaw.doc('user').set(userData as any)
  })

  test('get', async () => {
    const snap = await user.get()
    const data = snap.data()!

    expectType<IUser>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.any(storeAdmin.Timestamp),
    })
  })

  test('get collectionGroup', async () => {
    const snap = await usersGroup.select.teen().get()

    expect(snap.docs).toHaveLength(1)
    const data = snap.docs[0].data()

    expectType<IUser>(data)
    expect(data).toMatchObject({
      ...userData,
      timestamp: expect.any(storeAdmin.Timestamp),
    })
  })
})

describe('write', () => {
  describe('create', () => {
    test('normal', async () => {
      await storeAdmin.create(user, userData)

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any(storeAdmin.Timestamp),
        _updatedAt: expect.any(storeAdmin.Timestamp),
        timestamp: expect.any(storeAdmin.Timestamp),
      })
    })

    test('transaction', async () => {
      await storeAdmin.app.runTransaction(async ($) => {
        storeAdmin.$create($, user, userData)
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        _createdAt: expect.any(storeAdmin.Timestamp),
        _updatedAt: expect.any(storeAdmin.Timestamp),
        timestamp: expect.any(storeAdmin.Timestamp),
      })
    })
  })

  describe('setMerge', () => {
    beforeEach(async () => {
      await usersRaw.doc('user').set(userData as any)
    })

    test('normal', async () => {
      await storeAdmin.setMerge(user, {
        name: 'umi-kousaka',
        tags: storeAdmin.FieldValue.arrayUnion('tag2'),
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        name: 'umi-kousaka',
        tags: ['tag0', 'tag1', 'tag2'],
        _updatedAt: expect.any(storeAdmin.Timestamp),
        timestamp: expect.any(storeAdmin.Timestamp),
      })
    })

    test('transaction', async () => {
      await storeAdmin.app.runTransaction(async ($) => {
        const tsnap = await $.get(user)

        storeAdmin.$setMerge($, user, {
          age: tsnap.data()!.age + 1,
        })
      })

      const snapRaw = await usersRaw.doc('user').get()
      expect(snapRaw.data()).toMatchObject({
        ...userData,
        age: userData.age + 1,
        _updatedAt: expect.any(storeAdmin.Timestamp),
        timestamp: expect.any(storeAdmin.Timestamp),
      })
    })
  })
})
