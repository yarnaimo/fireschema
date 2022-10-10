import { SchemaCollectionName } from '../../types/_object.js'
import { FTypes, STypes } from '../../types/index.js'
import { FirestoreModel, InferFirestoreModelS } from '../model.js'
import { TypedSelectable } from './TypedCollectionRef.js'
import { TypedDocumentRef } from './TypedDocumentRef.js'
import { TypedFDBase } from './TypedFDBase.js'
import { TypedTransaction } from './TypedTransaction.js'
import { TypedWriteBatch } from './TypedWriteBatch.js'
import { FirestoreStatic } from './_static.js'
import type { Firestore } from 'firebase/firestore'
export declare class TypedFirestoreUniv<
  M extends FirestoreModel<STypes.RootOptions.All>,
  F extends FTypes.FirestoreApp,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> extends TypedFDBase<S, F, '', true> {
  readonly model: M
  readonly firestoreStatic: FirestoreStatic<F>
  readonly raw: F
  constructor(model: M, firestoreStatic: FirestoreStatic<F>, raw: F)
  private origGroup
  collectionGroup<N extends SchemaCollectionName<S>>(
    collectionName: N,
  ): TypedSelectable<
    S,
    F,
    S extends object
      ? {
          [K in keyof S & string]-?:
            | (import('../../types/_object.js').OmitDocLabel<K> extends N
                ? N & import('../../types/_object.js').OmitDocLabel<K>
                : never)
            | ((
                S[K] extends object
                  ? {
                      [K_1 in keyof S[K] & string]-?:
                        | (import('../../types/_object.js').OmitDocLabel<K_1> extends N
                            ? N &
                                import('../../types/_object.js').OmitDocLabel<K_1>
                            : never)
                        | ((
                            S[K][K_1] extends object
                              ? {
                                  [K_2 in keyof S[K][K_1] & string]-?:
                                    | (import('../../types/_object.js').OmitDocLabel<K_2> extends N
                                        ? N &
                                            import('../../types/_object.js').OmitDocLabel<K_2>
                                        : never)
                                    | ((
                                        S[K][K_1][K_2] extends object
                                          ? {
                                              [K_3 in keyof S[K][K_1][K_2] &
                                                string]-?:
                                                | (import('../../types/_object.js').OmitDocLabel<K_3> extends N
                                                    ? N &
                                                        import('../../types/_object.js').OmitDocLabel<K_3>
                                                    : never)
                                                | ((
                                                    S[K][K_1][K_2][K_3] extends object
                                                      ? {
                                                          [K_4 in keyof S[K][K_1][K_2][K_3] &
                                                            string]-?:
                                                            | (import('../../types/_object.js').OmitDocLabel<K_4> extends N
                                                                ? N &
                                                                    import('../../types/_object.js').OmitDocLabel<K_4>
                                                                : never)
                                                            | ((
                                                                S[K][K_1][K_2][K_3][K_4] extends object
                                                                  ? {
                                                                      [K_5 in keyof S[K][K_1][K_2][K_3][K_4] &
                                                                        string]-?: import('../../types/_object.js').OmitDocLabel<K_5> extends N
                                                                        ? N &
                                                                            import('../../types/_object.js').OmitDocLabel<K_5>
                                                                        : never
                                                                    }[keyof S[K][K_1][K_2][K_3][K_4] &
                                                                      string]
                                                                  : never
                                                              ) extends infer P
                                                                ? P extends string
                                                                  ? import('../../types/_object.js').JoinLoc<
                                                                      import('../../types/_object.js').OmitDocLabel<K_4>,
                                                                      P
                                                                    >
                                                                  : never
                                                                : never)
                                                        }[keyof S[K][K_1][K_2][K_3] &
                                                          string]
                                                      : never
                                                  ) extends infer P
                                                    ? P extends string
                                                      ? import('../../types/_object.js').JoinLoc<
                                                          import('../../types/_object.js').OmitDocLabel<K_3>,
                                                          P
                                                        >
                                                      : never
                                                    : never)
                                            }[keyof S[K][K_1][K_2] & string]
                                          : never
                                      ) extends infer P
                                        ? P extends string
                                          ? import('../../types/_object.js').JoinLoc<
                                              import('../../types/_object.js').OmitDocLabel<K_2>,
                                              P
                                            >
                                          : never
                                        : never)
                                }[keyof S[K][K_1] & string]
                              : never
                          ) extends infer P
                            ? P extends string
                              ? import('../../types/_object.js').JoinLoc<
                                  import('../../types/_object.js').OmitDocLabel<K_1>,
                                  P
                                >
                              : never
                            : never)
                    }[keyof S[K] & string]
                  : never
              ) extends infer P
                ? P extends string
                  ? import('../../types/_object.js').JoinLoc<
                      import('../../types/_object.js').OmitDocLabel<K>,
                      P
                    >
                  : never
                : never)
        }[keyof S & string]
      : never,
    STypes.DocDataAt<
      S,
      F,
      S extends object
        ? {
            [K in keyof S & string]-?:
              | (import('../../types/_object.js').OmitDocLabel<K> extends N
                  ? N & import('../../types/_object.js').OmitDocLabel<K>
                  : never)
              | ((
                  S[K] extends object
                    ? {
                        [K_1 in keyof S[K] & string]-?:
                          | (import('../../types/_object.js').OmitDocLabel<K_1> extends N
                              ? N &
                                  import('../../types/_object.js').OmitDocLabel<K_1>
                              : never)
                          | ((
                              S[K][K_1] extends object
                                ? {
                                    [K_2 in keyof S[K][K_1] & string]-?:
                                      | (import('../../types/_object.js').OmitDocLabel<K_2> extends N
                                          ? N &
                                              import('../../types/_object.js').OmitDocLabel<K_2>
                                          : never)
                                      | ((
                                          S[K][K_1][K_2] extends object
                                            ? {
                                                [K_3 in keyof S[K][K_1][K_2] &
                                                  string]-?:
                                                  | (import('../../types/_object.js').OmitDocLabel<K_3> extends N
                                                      ? N &
                                                          import('../../types/_object.js').OmitDocLabel<K_3>
                                                      : never)
                                                  | ((
                                                      S[K][K_1][K_2][K_3] extends object
                                                        ? {
                                                            [K_4 in keyof S[K][K_1][K_2][K_3] &
                                                              string]-?:
                                                              | (import('../../types/_object.js').OmitDocLabel<K_4> extends N
                                                                  ? N &
                                                                      import('../../types/_object.js').OmitDocLabel<K_4>
                                                                  : never)
                                                              | ((
                                                                  S[K][K_1][K_2][K_3][K_4] extends object
                                                                    ? {
                                                                        [K_5 in keyof S[K][K_1][K_2][K_3][K_4] &
                                                                          string]-?: import('../../types/_object.js').OmitDocLabel<K_5> extends N
                                                                          ? N &
                                                                              import('../../types/_object.js').OmitDocLabel<K_5>
                                                                          : never
                                                                      }[keyof S[K][K_1][K_2][K_3][K_4] &
                                                                        string]
                                                                    : never
                                                                ) extends infer P
                                                                  ? P extends string
                                                                    ? import('../../types/_object.js').JoinLoc<
                                                                        import('../../types/_object.js').OmitDocLabel<K_4>,
                                                                        P
                                                                      >
                                                                    : never
                                                                  : never)
                                                          }[keyof S[K][K_1][K_2][K_3] &
                                                            string]
                                                        : never
                                                    ) extends infer P
                                                      ? P extends string
                                                        ? import('../../types/_object.js').JoinLoc<
                                                            import('../../types/_object.js').OmitDocLabel<K_3>,
                                                            P
                                                          >
                                                        : never
                                                      : never)
                                              }[keyof S[K][K_1][K_2] & string]
                                            : never
                                        ) extends infer P
                                          ? P extends string
                                            ? import('../../types/_object.js').JoinLoc<
                                                import('../../types/_object.js').OmitDocLabel<K_2>,
                                                P
                                              >
                                            : never
                                          : never)
                                  }[keyof S[K][K_1] & string]
                                : never
                            ) extends infer P
                              ? P extends string
                                ? import('../../types/_object.js').JoinLoc<
                                    import('../../types/_object.js').OmitDocLabel<K_1>,
                                    P
                                  >
                                : never
                              : never)
                      }[keyof S[K] & string]
                    : never
                ) extends infer P
                  ? P extends string
                    ? import('../../types/_object.js').JoinLoc<
                        import('../../types/_object.js').OmitDocLabel<K>,
                        P
                      >
                    : never
                  : never)
          }[keyof S & string]
        : never
    >
  >
  wrapDocument<
    D extends FTypes.DocumentRef<any, F>,
    L extends string = STypes.InferDocT<D>['__loc__'],
  >(raw: D): TypedDocumentRef<S, F, L>
  runTransaction<T>(fn: (tt: TypedTransaction<S, F>) => Promise<T>): Promise<T>
  batch(): TypedWriteBatch<S, F>
}
export declare class TypedFirestoreWeb<
  M extends FirestoreModel<STypes.RootOptions.All>,
  S extends InferFirestoreModelS<M> = InferFirestoreModelS<M>,
> extends TypedFirestoreUniv<M, Firestore, S> {
  readonly model: M
  readonly raw: Firestore
  constructor(model: M, raw: Firestore)
}
