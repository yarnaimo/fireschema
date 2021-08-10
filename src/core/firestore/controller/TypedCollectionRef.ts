import { P } from 'lifts'
import { R } from '../../../lib/fp'
import { $model } from '../../constants'
import { FTypes, STypes } from '../../types'
import { GetByLoc, JoinLoc, OmitLastSegment } from '../../types/_object'
import { getCollectionOptions } from '../../utils/_firestore'
import { getLastSegment, omitLastSegment } from '../../utils/_object'
import {
  QueryDocumentSnapDataOptions,
  TypedDocumentRef,
  TypedQueryDocumentSnap,
} from './TypedDocumentRef'
import { withDecoder } from './_query-cache'
import { FirestoreStatic } from './_static'
import { docUniv, getDocsUniv, GetSource, queryUniv } from './_universal'

export class TypedQuerySnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly typedDocs: TypedQueryDocumentSnap<S, F, L, U>[]

  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FirestoreStatic<F>
      loc: L
    },
    readonly raw: FTypes.QuerySnap<U, F>,
  ) {
    this.typedDocs = raw.docs.map((rawDocSnap) => {
      return new TypedQueryDocumentSnap<S, F, L, U>(
        options,
        rawDocSnap as FTypes.QueryDocumentSnap<U, F>,
      )
    })
  }
}

export class TypedQueryRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly raw: FTypes.Query<U, F>

  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FirestoreStatic<F>
      loc: L
    },
    origQuery: FTypes.Query<any, F>,
    selector?: STypes.Selector<S, F, L>,
    skipDecoder?: boolean,
  ) {
    const name = getLastSegment(options.loc)
    const collectionOptions = getCollectionOptions(
      options.schemaOptions,
      options.loc,
    )

    const convertedQuery = P(
      origQuery,
      skipDecoder ? R.identity : withDecoder(collectionOptions[$model], name),

      (query) => {
        if (!selector) {
          return query
        }

        return queryUniv(query, (q) => {
          const selectorsConstraint = collectionOptions[$model].selectors(
            q,
            this.options.firestoreStatic,
          ) as STypes.GetSL<GetByLoc<S, L>>

          return selector(selectorsConstraint)
        })
      },
    ) as FTypes.Query<any, F>

    this.raw = convertedQuery
  }

  async get({ from }: { from?: GetSource } = {}) {
    const snap = await getDocsUniv(this.raw, from)

    return new TypedQuerySnap<S, F, L, U>(
      this.options,
      snap as FTypes.QuerySnap<U, F>,
    )
  }

  async getData<V = U>({
    from,
    ...dataOptions
  }: {
    from?: GetSource
  } & QueryDocumentSnapDataOptions<S, F, L, U, V> = {}): Promise<V[]> {
    const typedSnap = await this.get({ from })
    return typedSnap.typedDocs.map<V>((snap) => snap.data(dataOptions))
  }
}

export class TypedCollectionRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedQueryRef<S, F, L, U> {
  readonly id: string
  readonly path: string

  declare readonly raw: FTypes.CollectionRef<U, F>

  constructor(
    readonly options: {
      schemaOptions: S
      firestoreStatic: FirestoreStatic<F>
      loc: L
    },
    origCollection: FTypes.CollectionRef<any, F>,
    skipDecoder?: boolean,
  ) {
    super(options, origCollection, undefined, skipDecoder)
    this.id = this.raw.id
    this.path = this.raw.path
  }

  doc(id?: string) {
    const docRaw = docUniv(this.raw, id) as FTypes.DocumentRef<any, F>
    return new TypedDocumentRef<S, F, L>(this.options, docRaw)
  }

  parentDocument<
    PL extends OmitLastSegment<L> = OmitLastSegment<L>,
  >(): L extends JoinLoc<string, string>
    ? TypedDocumentRef<S, F, PL>
    : undefined {
    if (!this.options.loc.includes('.')) {
      return undefined as any
    }
    const parentDocLoc = omitLastSegment(this.options.loc) as PL
    const origPDoc = this.raw.parent! as FTypes.DocumentRef<any, F>

    const parentTypedCollection = new TypedCollectionRef<S, F, PL>(
      { ...this.options, loc: parentDocLoc },
      origPDoc.parent as FTypes.CollectionRef<any, F>,
    )
    return parentTypedCollection.doc(origPDoc.id) as any
  }
}
