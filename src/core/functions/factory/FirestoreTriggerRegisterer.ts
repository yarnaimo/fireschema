import { _admin } from '../../../lib/firestore-types'
import { _fadmin } from '../../../lib/functions-types'
import { $schema } from '../../constants'
import { FunTypes, STypes, STypeUtils } from '../../types'
import { ParseDocumentPath } from '../../types/_firestore'
import {
  firestorePathToLoc,
  getCollectionOptions,
} from '../../utils/_firestore'

type F = _admin.Firestore

export const FirestoreTriggerRegisterer = <S extends STypes.RootOptions.All>(
  firestoreSchema: S,
  firestoreStatic: typeof _admin,
  functions: typeof import('firebase-functions'),
) => {
  const buildDecoder = (path: string) => {
    const loc = firestorePathToLoc(path)
    const collectionOptions = getCollectionOptions(firestoreSchema, loc)
    const { decoder } = collectionOptions[$schema]

    return (snap: _admin.QueryDocumentSnapshot<any>) => {
      const data = snap.data()
      return decoder ? decoder(data, snap) : data
    }
  }

  const buildSnapDecoder = (path: string) => {
    const decode = buildDecoder(path)

    return (documentSnap: _admin.DocumentSnapshot) =>
      documentSnap instanceof firestoreStatic.QueryDocumentSnapshot
        ? decode(documentSnap)
        : undefined
  }

  type OnCreateOrDelete = <
    DP extends string,
    L extends string = ParseDocumentPath<DP>
  >(options: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnCreateOrDeleteHandler<
      STypeUtils.FTDocDataAt<S, F, L>,
      STypeUtils.DocDataAt<S, F, L>
    >
  }) => _fadmin.CloudFunction<_admin.QueryDocumentSnapshot>

  type OnUpdate = <
    DP extends string,
    L extends string = ParseDocumentPath<DP>
  >(options: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnUpdateHandler<
      STypeUtils.FTDocDataAt<S, F, L>,
      STypeUtils.DocDataAt<S, F, L>
    >
  }) => _fadmin.CloudFunction<_fadmin.Change<_admin.QueryDocumentSnapshot>>

  type OnWrite = <
    DP extends string,
    L extends string = ParseDocumentPath<DP>
  >(options: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnWriteHandler<
      STypeUtils.FTDocDataAt<S, F, L>,
      STypeUtils.DocDataAt<S, F, L>
    >
  }) => _fadmin.CloudFunction<_fadmin.Change<_admin.DocumentSnapshot>>

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
