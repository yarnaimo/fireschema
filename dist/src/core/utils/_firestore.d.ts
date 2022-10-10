import { FTypes, STypes } from '../types/index.js'
export declare const firestorePathToLoc: (path: string) => string
export declare const createConverter: (
  decoder: STypes.Model.Decoder<any, any> | undefined,
) => {
  fromFirestore: (
    snap: FTypes.QueryDocumentSnap<any>,
    options: FTypes.SnapshotOptions,
  ) => any
  toFirestore: (data: any) => any
}
