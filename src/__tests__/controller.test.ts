import { user, users } from './fixtures/collections'
import { dbAdmin } from './infrastructure/firestore'
import { expectEqualRef } from './utils/firestore'

describe('refs', () => {
  test('collection', () => {
    expectEqualRef(
      dbAdmin.collection('versions').doc('v1').collection('users').doc('user'),
      user,
    )
  })

  test('query', () => {
    expectEqualRef(
      dbAdmin
        .collection('versions')
        .doc('v1')
        .collection('users')
        .where('age', '>=', 18),

      users.select.adults(),
    )
  })
})

// post.get().then((a) => a.data())
