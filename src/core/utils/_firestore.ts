import { FTypes, STypes } from '../types/index.js'
import { getByLoc } from './_object.js'

export const firestorePathToLoc = (path: string) =>
  path
    .split('/')
    .filter((_, i) => i % 2 === 0)
    .join('.')

export const getCollectionOptions = (
  schemaOptions: STypes.RootOptions.All,
  loc: string,
) => getByLoc(schemaOptions, loc) as STypes.CollectionOptions.Meta

export const createConverter = (
  decoder: STypes.Model.Decoder<any, any> | undefined,
) => ({
  fromFirestore: (
    snap: FTypes.QueryDocumentSnap<any>,
    options: FTypes.SnapshotOptions,
  ) => {
    const data = snap.data(options)
    const decodedData = decoder ? decoder(data, snap) : data

    return {
      ...decodedData,
      id: snap.id,
    }
  },
  toFirestore: (data: any) => data,
})
