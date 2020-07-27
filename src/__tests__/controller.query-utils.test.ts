import dayjs from 'dayjs'
import { Combine, CreatedWithin } from '..'
import { FTypes } from '../types'
import { IUser } from './fixtures/schema'
import { users } from './infrastructure/collections'
import { expectEqualRef } from './utils/firestore'

const Tags = (query: FTypes.Query<IUser>) => (tagIds: string[]) =>
  query.where('tags', 'array-contains-any', tagIds)

const tagIds = ['81', '117']
const since = dayjs('2020-01-17')
const until = dayjs('2020-08-10')

test('CreatedWithin', () => {
  CreatedWithin(users.ref)({ since })

  expectEqualRef(
    CreatedWithin(users.ref)({ since }),
    users.ref.where('_createdAt', '>=', since.toDate()) as any,
  )

  expectEqualRef(
    CreatedWithin(users.ref)({ until }),
    users.ref.where('_createdAt', '<', until.toDate()) as any,
  )

  expectEqualRef(
    CreatedWithin(users.ref)({ since, until }),
    users.ref
      .where('_createdAt', '>=', since.toDate())
      .where('_createdAt', '<', until.toDate()) as any,
  )
})

test('Combine', () => {
  const tags$createdWithin = Combine(users.ref)(Tags, CreatedWithin)

  expectEqualRef(
    tags$createdWithin(tagIds, { since, until }),
    users.ref
      .where('tags', 'array-contains-any', tagIds)
      .where('_createdAt', '>=', since.toDate())
      .where('_createdAt', '<', until.toDate()) as any,
  )
})
