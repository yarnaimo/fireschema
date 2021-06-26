import { P } from 'lifts'
import { _web } from '../../../../lib/firestore-types'
import { R } from '../../../../lib/fp'
import { $schema } from '../../../constants'
import { FTypes, STypes } from '../../../types'
import { JoinLoc, OmitLastSegment } from '../../../types/_object'
import { getCollectionOptions } from '../../../utils/_firestore'
import { getLastSegment, omitLastSegment } from '../../../utils/_object'
import { TypedDocumentRef, TypedQueryDocumentSnap } from './TypedDocumentRef'
import { withDecoder, withSelectors } from './_utils'

export class TypedQuerySnap<
  S extends STypes.RootOptions.All,
  F extends FTypes.FirestoreApp,
  L extends string,
  U = STypes.DocDataAt<S, F, L>,
> {
  readonly typedDocs: TypedQueryDocumentSnap<S, F, L, U>[]

  constructor(
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly loc: L,
    readonly raw: FTypes.QuerySnap<U, F>,
  ) {
    this.typedDocs = raw.docs.map((rawDocSnap) => {
      return new TypedQueryDocumentSnap<S, F, L, U>(
        schemaOptions,
        firestoreStatic,
        loc,
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
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly loc: L,
    origQuery: FTypes.Query<any, F>,
    selector?: STypes.Selector<S, F, L>,
    skipDecoder?: boolean,
  ) {
    const name = getLastSegment(loc)
    const options = getCollectionOptions(schemaOptions, loc)

    const convertedQuery = P(
      origQuery,
      skipDecoder ? R.identity : withDecoder(options[$schema], name),
      withSelectors(options[$schema], this.firestoreStatic, selector),
    ) as FTypes.Query<any, F>

    this.raw = convertedQuery
  }

  async get(options?: _web.GetOptions) {
    const snap = await this.raw.get(options)

    return new TypedQuerySnap<S, F, L, U>(
      this.schemaOptions,
      this.firestoreStatic,
      this.loc,
      snap as FTypes.QuerySnap<U, F>,
    )
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
    readonly schemaOptions: S,
    readonly firestoreStatic: FTypes.FirestoreStatic<F>,
    readonly loc: L,
    origCollection: FTypes.CollectionRef<any, F>,
    skipDecoder?: boolean,
  ) {
    super(
      schemaOptions,
      firestoreStatic,
      loc,
      origCollection,
      undefined,
      skipDecoder,
    )
    this.id = this.raw.id
    this.path = this.raw.path
  }

  doc(id?: string) {
    const idArgs = id ? [id] : []
    const docRaw = this.raw.doc(...idArgs) as FTypes.DocumentRef<any, F>

    return new TypedDocumentRef<S, F, L>(
      this.schemaOptions,
      this.firestoreStatic,
      this.loc,
      docRaw,
    )
  }

  parentDocument<
    PL extends OmitLastSegment<L> = OmitLastSegment<L>,
  >(): L extends JoinLoc<string, string>
    ? TypedDocumentRef<S, F, PL>
    : undefined {
    if (!this.loc.includes('.')) {
      return undefined as any
    }
    const parentDocLoc = omitLastSegment(this.loc) as PL
    const origPDoc = this.raw.parent! as FTypes.DocumentRef<any, F>

    const parentTypedCollection = new TypedCollectionRef<S, F, PL>(
      this.schemaOptions,
      this.firestoreStatic,
      parentDocLoc,
      origPDoc.parent as FTypes.CollectionRef<any, F>,
    )
    return parentTypedCollection.doc(origPDoc.id) as any
  }
}
