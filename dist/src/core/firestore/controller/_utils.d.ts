import { _admin, _web } from '../../../lib/firestore-types.js'
import { FTypes } from '../../types/index.js'
import { FirestoreStatic } from './_static.js'
export declare const docAsWeb: <U>(
  ref: _web.DocumentReference<U> | _admin.DocumentReference<U>,
) => _web.DocumentReference<U>
export declare const docAsAdmin: <U>(
  ref: _web.DocumentReference<U> | _admin.DocumentReference<U>,
) => _admin.DocumentReference<U>
export declare type DataOrFn<T> =
  | T
  | (<F extends FTypes.FirestoreApp>(firestoreStatic: FirestoreStatic<F>) => T)
export declare class DocDataHelper<F extends FTypes.FirestoreApp> {
  readonly firestoreStatic: FirestoreStatic<F>
  mergeOptions: {
    merge: boolean
  }
  constructor(firestoreStatic: FirestoreStatic<F>)
  private toCreate
  private toUpdate
  private dataOf
  create<T>(dataOrFn: DataOrFn<T>): readonly [any]
  setMerge<T>(dataOrFn: DataOrFn<T>): readonly [
    any,
    {
      merge: boolean
    },
  ]
  update<T>(dataOrFn: DataOrFn<T>): readonly [any]
}
