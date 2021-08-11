import { FTypes } from '../../types/index.js'
import { createConverter } from '../../utils/_firestore.js'
import { DataModel } from '../model.js'
import { queryEqualUniv } from './_universal.js'

type CachedQuery = {
  raw: FTypes.Query<any>
  converted: FTypes.Query<any>
}

const queryCache: {
  [K in string]?: CachedQuery[]
} = {}

export const findCachedQuery = (
  collectionName: string,
  rawQuery: FTypes.Query<any>,
) => {
  const queries = queryCache[collectionName]
  return queries?.find((q) => queryEqualUniv(q.raw, rawQuery))?.converted
}

export const addQueryCache = (
  collectionName: string,
  rawQuery: FTypes.Query<any>,
  convertedQuery: FTypes.Query<any>,
) => {
  const queries = queryCache[collectionName]
  const newQueries: CachedQuery[] = [
    ...(queries ?? []),
    { raw: rawQuery, converted: convertedQuery },
  ]
  queryCache[collectionName] = newQueries
}

export const withDecoder =
  (model: DataModel<any, any, any>, collectionName: string) =>
  <F extends FTypes.FirestoreApp>(rawQuery: FTypes.Query<F>) => {
    const { decoder } = model

    const cachedQuery = findCachedQuery(collectionName, rawQuery)
    if (cachedQuery) {
      return cachedQuery
    }

    const convertedQuery = (rawQuery.withConverter as any)(
      createConverter(decoder),
    ) as FTypes.Query<F>

    addQueryCache(collectionName, rawQuery, convertedQuery)

    return convertedQuery
  }
