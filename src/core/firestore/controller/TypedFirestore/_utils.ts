import { _createdAt, _updatedAt } from '../../../constants'
import { FTypes, STypes } from '../../../types'
import { createConverter } from '../../../utils/_firestore'
import { addQueryCache, findCachedQuery } from '../_query-cache'

export const withSelectors = (
  schema: STypes.CollectionSchema<any, any, any>,
  firestoreStatic: FTypes.FirestoreStatic<FTypes.FirestoreApp>,
  selector: STypes.Selector<any, any, any> | undefined,
) => (query: FTypes.Query<unknown>) => {
  return selector ? selector(schema.selectors(query, firestoreStatic)) : query
}

export const withDecoder = (
  schema: STypes.CollectionSchema<any, any, any>,
  collectionName: string,
) => (rawQuery: FTypes.Query<any>) => {
  const { decoder } = schema

  const cachedQuery = findCachedQuery(collectionName, rawQuery)
  if (cachedQuery) {
    return cachedQuery
  }

  const convertedQuery = (rawQuery.withConverter as any)(
    createConverter(decoder),
  ) as FTypes.Query<any>

  addQueryCache(collectionName, rawQuery, convertedQuery)

  return convertedQuery
}

export class DocDataHelper<F extends FTypes.FirestoreApp> {
  mergeOptions = { merge: true }

  constructor(readonly firestoreStatic: FTypes.FirestoreStatic<F>) {}

  _toCreate<T>(data: T): any {
    return {
      ...data,
      [_createdAt]: this.firestoreStatic.FieldValue.serverTimestamp(),
      [_updatedAt]: this.firestoreStatic.FieldValue.serverTimestamp(),
    }
  }
  _toUpdate<T>(data: T): any {
    return {
      ...data,
      [_updatedAt]: this.firestoreStatic.FieldValue.serverTimestamp(),
    }
  }

  create<T>(data: T) {
    return [this._toCreate(data)] as const
  }
  setMerge<T>(data: T) {
    return [this._toUpdate(data), this.mergeOptions] as const
  }
  update<T>(data: T) {
    return [this._toUpdate(data)] as const
  }
}
