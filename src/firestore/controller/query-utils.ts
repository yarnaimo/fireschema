import dayjs from 'dayjs'
import { P } from 'lifts'
import { Type } from '../../lib/type'
import { FTypes } from '../../types'
import { _createdAt } from '../constants'

type _SpanOption = { since: dayjs.Dayjs; until: dayjs.Dayjs }
export type SpanQueryOption =
  | _SpanOption
  | Type.SetOptional<_SpanOption, 'since'>
  | Type.SetOptional<_SpanOption, 'until'>

export const CreatedWithin = <T>(query: FTypes.Query<T>) => ({
  since,
  until,
}: SpanQueryOption) => {
  return P(
    query,
    (q) => (since ? q.where(_createdAt, '>=', since.toDate()) : q),
    (q) => (until ? q.where(_createdAt, '<', until.toDate()) : q),
  )
}

export const Combine = <T>(query: FTypes.Query<T>) => <
  Ss extends ((query: FTypes.Query<T>) => (arg: any) => any)[]
>(
  ...Selectors: Ss
) => {
  // eslint-disable-next-line
  // @ts-ignore
  return (...args: { [I in keyof Ss]: Parameters<ReturnType<Ss[I]>>[0] }) => {
    return Selectors.reduce((q, selector, i) => selector(q)(args[i]), query)
  }
}
