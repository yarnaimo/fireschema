import type { Change, CloudFunction, FunctionBuilder } from 'firebase-functions'
import { FunTypes } from '..'
import { STypes } from '../..'
import { $schema, STypeUtils } from '../../firestore'
import { ParseDocumentPath } from '../../firestore/_types'
import {
  firestorePathToLoc,
  getCollectionOptions,
} from '../../firestore/_utils'
import { fadmin } from '../../types/_firestore'
import { GetDeep } from '../../types/_object'

export const FirestoreTriggerRegisterer = <S extends STypes.RootOptions.All>(
  firestoreSchema: S,
  firestoreStatic: typeof fadmin,
  functions: typeof import('firebase-functions'),
) => {
  const buildDecoder = (path: string) => {
    const loc = firestorePathToLoc(path)
    const collectionOptions = getCollectionOptions(firestoreSchema, loc)
    const { decoder } = collectionOptions[$schema]

    return (snap: fadmin.QueryDocumentSnapshot<any>) =>
      decoder ? decoder(snap, undefined) : snap.data()
  }

  const buildSnapDecoder = (path: string) => {
    const decode = buildDecoder(path)

    return (documentSnap: fadmin.DocumentSnapshot) =>
      documentSnap instanceof firestoreStatic.QueryDocumentSnapshot
        ? decode(documentSnap)
        : undefined
  }

  type OnCreateOrDelete = <
    DP extends string,
    L extends string[] = ParseDocumentPath<DP>,
    _C = GetDeep<S, L>,
    T = STypeUtils.GetT<_C>,
    U = STypeUtils.SchemaUWithLocAndMeta<fadmin.Firestore, _C, L>
  >(options: {
    builder: FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnCreateOrDeleteHandler<T, U>
  }) => CloudFunction<fadmin.QueryDocumentSnapshot>

  type OnUpdate = <
    DP extends string,
    L extends string[] = ParseDocumentPath<DP>,
    _C = GetDeep<S, L>,
    T = STypeUtils.GetT<_C>,
    U = STypeUtils.SchemaUWithLocAndMeta<fadmin.Firestore, _C, L>
  >(options: {
    builder: FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnUpdateHandler<T, U>
  }) => CloudFunction<Change<fadmin.QueryDocumentSnapshot>>

  type OnWrite = <
    DP extends string,
    L extends string[] = ParseDocumentPath<DP>,
    _C = GetDeep<S, L>,
    T = STypeUtils.GetT<_C>,
    U = STypeUtils.SchemaUWithLocAndMeta<fadmin.Firestore, _C, L>
  >(options: {
    builder: FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnWriteHandler<T, U>
  }) => CloudFunction<Change<fadmin.DocumentSnapshot>>

  const onCreate: OnCreateOrDelete = ({ builder, path, handler }) => {
    const decode = buildDecoder(path)

    return builder.firestore.document(path).onCreate((snap, context) => {
      const decodedData = decode(snap)
      return handler(decodedData, snap as any, context)
    })
  }

  const onDelete: OnCreateOrDelete = ({ builder, path, handler }) => {
    const decode = buildDecoder(path)

    return builder.firestore.document(path).onDelete((snap, context) => {
      const decodedData = decode(snap)
      return handler(decodedData, snap as any, context)
    })
  }

  const onUpdate: OnUpdate = ({ builder, path, handler }) => {
    const decode = buildDecoder(path)

    return builder.firestore.document(path).onUpdate((change, context) => {
      const decodedData = new functions.Change(
        decode(change.before),
        decode(change.after),
      )
      return handler(decodedData, change as any, context)
    })
  }

  const onWrite: OnWrite = ({ builder, path, handler }) => {
    const decode = buildSnapDecoder(path)

    return builder.firestore.document(path).onWrite((change, context) => {
      const decodedData = new functions.Change(
        decode(change.before),
        decode(change.after),
      )
      return handler(decodedData, change as any, context)
    })
  }

  return { onCreate, onUpdate, onDelete, onWrite }
}
