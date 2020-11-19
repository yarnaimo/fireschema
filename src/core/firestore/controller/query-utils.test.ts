import dayjs from 'dayjs'
import { IUser } from '../../../__tests__/_fixtures/firestore-schema'
import { authedApp } from '../../../__tests__/_infrastructure/_app'
// import { $web } from '../_infrastructure/firestore-controller'
import { expectEqualRef } from '../../../__tests__/_utils/firestore'
import { FTypes } from '../../types'
import { Combine, CreatedWithin } from './query-utils'

const app = authedApp('user').firestore()

const users = app.collection('users') as FTypes.CollectionRef<IUser>

const Tags = (query: FTypes.Query<IUser>) => (tagIds: string[]) =>
  query.where('tags', 'array-contains-any', tagIds)

const tagIds = ['81', '117']
const since = dayjs('2020-01-17')
const until = dayjs('2020-08-10')

test('CreatedWithin', () => {
  CreatedWithin(users)({ since })

  expectEqualRef(
    CreatedWithin(users)({ since }),
    users.where('_createdAt', '>=', since.toDate()) as any,
  )

  expectEqualRef(
    CreatedWithin(users)({ until }),
    users.where('_createdAt', '<', until.toDate()) as any,
  )

  expectEqualRef(
    CreatedWithin(users)({ since, until }),
    users
      .where('_createdAt', '>=', since.toDate())
      .where('_createdAt', '<', until.toDate()) as any,
  )
})

test('Combine', () => {
  const tags$createdWithin = Combine(users)(Tags, CreatedWithin)

  expectEqualRef(
    tags$createdWithin(tagIds, { since, until }),
    users
      .where('tags', 'array-contains-any', tagIds)
      .where('_createdAt', '>=', since.toDate())
      .where('_createdAt', '<', until.toDate()) as any,
  )
})
