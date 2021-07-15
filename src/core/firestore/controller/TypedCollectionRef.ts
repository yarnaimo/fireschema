import { P } from 'lifts'
import { R } from '../../../lib/fp'
import { $model } from '../../constants'
import { FTypes, STypes } from '../../types'
import { JoinLoc, OmitLastSegment } from '../../types/_object'
import { getCollectionOptions } from '../../utils/_firestore'
import { getLastSegment, omitLastSegment } from '../../utils/_object'
import {
  QueryDocumentSnapDataOptions,
  TypedDocumentRef,
  TypedQueryDocumentSnap,
} from './TypedDocumentRef'
import { withDecoder, withSelectors } from './_utils'

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
      firestoreStatic: FTypes.FirestoreStatic<F>
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
      firestoreStatic: FTypes.FirestoreStatic<F>
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
      withSelectors(
        collectionOptions[$model],
        this.options.firestoreStatic,
        selector,
      ),
    ) as FTypes.Query<any, F>

    this.raw = convertedQuery
  }

  async get(getOptions?: FTypes.GetOptions<F>) {
    const snap = await this.raw.get(getOptions)

    return new TypedQuerySnap<S, F, L, U>(
      this.options,
      snap as FTypes.QuerySnap<U, F>,
    )
  }

  async getData<V = U>({
    getOptions,
    ...dataOptions
  }: {
    getOptions?: FTypes.GetOptions<F>
  } & QueryDocumentSnapDataOptions<S, F, L, U, V> = {}): Promise<V[]> {
    const typedSnap = await this.get(getOptions)
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
      firestoreStatic: FTypes.FirestoreStatic<F>
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
    const idArgs = id ? [id] : []
    const docRaw = this.raw.doc(...idArgs) as FTypes.DocumentRef<any, F>

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
