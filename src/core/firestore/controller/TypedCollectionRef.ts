import { JoinLoc, OmitLastSegment } from '../../types/_object.js'
import { FTypes, STypes } from '../../types/index.js'
import {
  getLastSegment,
  getSchemaOptionsByLoc,
  omitLastSegment,
} from '../../utils/_object.js'
import { TypedConstructorOptions } from './ConstructorOptions'
import {
  QueryDocumentSnapDataOptions,
  TypedDocumentRef,
  TypedQueryDocumentSnap,
} from './TypedDocumentRef.js'
import { withDecoder } from './_query-cache.js'
import {
  GetSource,
  docUniv,
  getDocsUniv,
  queryBuilderUniv,
  queryUniv,
} from './_universal.js'

export class TypedQuerySnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly typedDocs: TypedQueryDocumentSnap<S, F, L, U>[]

  constructor(
    readonly options: TypedConstructorOptions<S, F, L>,
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
  readonly collectionOptions: STypes.CollectionOptions.Meta

  constructor(
    readonly options: TypedConstructorOptions<S, F, L>,
    origQuery: FTypes.Query<any, F>,
    skipDecoder?: boolean,
  ) {
    const name = getLastSegment(options.loc)
    this.collectionOptions = getSchemaOptionsByLoc(
      options.schemaOptions,
      options.loc,
    )

    const convertedQuery = skipDecoder
      ? origQuery
      : withDecoder(origQuery, this.collectionOptions.model, name)

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

export class TypedSelectable<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedQueryRef<S, F, L, U> {
  readonly select: STypes.MappedSelectors<S, F, L>

  constructor(
    options: TypedConstructorOptions<S, F, L>,
    origQuery: FTypes.Query<any, F>,
    skipDecoder?: boolean,
  ) {
    super(options, origQuery, skipDecoder)

    const selectorsConstraint = this.collectionOptions.model.selectors(
      queryBuilderUniv(this.raw),
      this.options.firestoreStatic,
    )

    this.select = Object.fromEntries(
      Object.entries(selectorsConstraint).map(([k, fn]) => {
        return [
          k,
          (...args: any[]) => {
            const queryConstraints = fn(...args)
            const query = queryUniv(this.raw, queryConstraints)

            return new TypedQueryRef<S, F, L, U>(
              this.options,
              query as FTypes.Query<any, F>,
              true,
            )
          },
        ]
      }),
    ) as STypes.MappedSelectors<S, F, L>
  }
}

export class TypedCollectionRef<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> extends TypedSelectable<S, F, L, U> {
  readonly id: string
  readonly path: string

  declare readonly raw: FTypes.CollectionRef<U, F>

  constructor(
    readonly options: TypedConstructorOptions<S, F, L>,
    origCollection: FTypes.CollectionRef<any, F>,
    skipDecoder?: boolean,
  ) {
    super(options, origCollection, skipDecoder)
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
