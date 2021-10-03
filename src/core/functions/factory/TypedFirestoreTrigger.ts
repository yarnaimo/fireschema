import { _admin } from '../../../lib/firestore-types'
import { _fadmin } from '../../../lib/functions-types'
import { ParseDocumentPath } from '../../types/_firestore.js'
import { FunTypes, STypes } from '../../types/index.js'
import { firestorePathToLoc } from '../../utils/_firestore.js'
import { getSchemaOptionsByLoc } from '../../utils/_object.js'

type F = _admin.Firestore

export class TypedFirestoreTrigger<S extends STypes.RootOptions.All> {
  constructor(
    readonly firestoreSchema: S,
    readonly firestoreStatic: typeof _admin,
    readonly functions: typeof import('firebase-functions'),
  ) {}

  private buildDecoder(path: string) {
    const loc = firestorePathToLoc(path)
    const collectionOptions = getSchemaOptionsByLoc(this.firestoreSchema, loc)
    const { decoder } = collectionOptions.model

    return (snap: _admin.QueryDocumentSnapshot<any>) => {
      const data = snap.data()
      return decoder ? decoder(data, snap) : data
    }
  }

  private buildSnapDecoder(path: string) {
    const decode = this.buildDecoder(path)

    return (documentSnap: _admin.DocumentSnapshot) =>
      documentSnap instanceof this.firestoreStatic.QueryDocumentSnapshot
        ? decode(documentSnap)
        : undefined
  }

  onCreate<DP extends string, L extends string = ParseDocumentPath<DP>>({
    builder,
    path,
    handler,
  }: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnCreateOrDeleteHandler<
      STypes.FTDocDataAt<S, F, L>,
      STypes.DocDataAt<S, F, L>
    >
  }): _fadmin.CloudFunction<_admin.QueryDocumentSnapshot> {
    const decode = this.buildDecoder(path)

    return builder.firestore.document(path).onCreate(async (snap, context) => {
      const decodedData = decode(snap)
      return handler(decodedData, snap as any, context)
    })
  }

  onDelete<DP extends string, L extends string = ParseDocumentPath<DP>>({
    builder,
    path,
    handler,
  }: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnCreateOrDeleteHandler<
      STypes.FTDocDataAt<S, F, L>,
      STypes.DocDataAt<S, F, L>
    >
  }): _fadmin.CloudFunction<_admin.QueryDocumentSnapshot> {
    const decode = this.buildDecoder(path)

    return builder.firestore.document(path).onDelete(async (snap, context) => {
      const decodedData = decode(snap)
      return handler(decodedData, snap as any, context)
    })
  }

  onUpdate<DP extends string, L extends string = ParseDocumentPath<DP>>({
    builder,
    path,
    handler,
  }: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnUpdateHandler<
      STypes.FTDocDataAt<S, F, L>,
      STypes.DocDataAt<S, F, L>
    >
  }): _fadmin.CloudFunction<_fadmin.Change<_admin.QueryDocumentSnapshot>> {
    const decode = this.buildDecoder(path)

    return builder.firestore
      .document(path)
      .onUpdate(async (change, context) => {
        const decodedData = new this.functions.Change(
          decode(change.before),
          decode(change.after),
        )
        return handler(decodedData, change as any, context)
      })
  }

  onWrite<DP extends string, L extends string = ParseDocumentPath<DP>>({
    builder,
    path,
    handler,
  }: {
    builder: _fadmin.FunctionBuilder
    path: DP
    handler: FunTypes.FirestoreTrigger.OnWriteHandler<
      STypes.FTDocDataAt<S, F, L>,
      STypes.DocDataAt<S, F, L>
    >
  }): _fadmin.CloudFunction<_fadmin.Change<_admin.DocumentSnapshot>> {
    const decode = this.buildSnapDecoder(path)

    return builder.firestore.document(path).onWrite(async (change, context) => {
      const decodedData = new this.functions.Change(
        decode(change.before),
        decode(change.after),
      )
      return handler(decodedData, change as any, context)
    })
  }
}
