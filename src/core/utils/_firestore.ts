import { STypes, STypeUtils } from '../types'
import { getDeep } from './_object'

export const firestorePathToLoc = (path: string) =>
  path.split('/').filter((_, i) => i % 2 === 0)

export const getLocOfDocOrApp = (parentOrRoot: STypeUtils.Parent) => {
  if ('path' in parentOrRoot) {
    return firestorePathToLoc(parentOrRoot.path)
  }
  return []
}

export const getCollectionOptions = (
  schemaOptions: STypes.RootOptions.All,
  loc: string[],
) => getDeep(schemaOptions, loc) as STypes.CollectionOptions.Meta

export const childLoc = (parent: STypeUtils.Parent, collectionName: string) => [
  ...getLocOfDocOrApp(parent),
  collectionName,
]

export const createConverter = (decoder: STypes.Decoder<any, any>) => ({
  fromFirestore: decoder,
  toFirestore: (data: any) => data,
})

export const lastUpdatedByTrigger = (
  before: STypes.DocumentMeta,
  after: STypes.DocumentMeta,
) => {
  if (!after._lastUpdateByTrigger) {
    return false
  }
  if (!before._lastUpdateByTrigger) {
    return true
  }
  if (
    before._lastUpdateByTrigger.toMillis() <
    after._lastUpdateByTrigger.toMillis()
  ) {
    return true
  }
  return false
}
