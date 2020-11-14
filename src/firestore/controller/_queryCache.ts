import { FTypes } from '../..'

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
  return queries?.find((q) => q.raw.isEqual(rawQuery as any))?.converted
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
