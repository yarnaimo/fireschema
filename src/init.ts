import { FireTypes } from './types/fire-types'
import { Fireschema } from './types/fireschema'
import { fadmin, fweb } from './types/firestore'
import { getDeep, GetDeep } from './types/object'
import { $schema } from './utils'

const getLoc = (parentOrRoot: FireTypes.DocumentRef<unknown>) =>
  parentOrRoot.path.split('/').filter((_, i) => i % 2 === 0)

type DocumentSchemaLoc<L extends string[]> = {
  __loc__: L
}

type GetDocT<
  D extends 'root' | FireTypes.DocumentRef<unknown>
> = D extends FireTypes.DocumentRef<infer T> ? T : never

type GetOptionsType<
  Options
> = Options extends Fireschema.DataSchemaOptionsWithType<unknown>
  ? Options['__T__']
  : Options extends Fireschema.DataSchemaOptionsWithType<unknown>[]
  ? Options[number]['__T__']
  : never

export const initFirestore = <
  F extends FireTypes.Firestore,
  S extends Fireschema.RootOptions.All
>(
  { FieldValue, Timestamp }: typeof fweb | typeof fadmin,
  instance: F,
  schema: S,
) => {
  const initCollection = <
    P extends 'root' | FireTypes.DocumentRef<DocumentSchemaLoc<string[]>>,
    C extends keyof POptions & string,
    // PT extends DocumentSchemaLoc<Loc<S>> = DocumentSchemaLoc<Loc<S>>,
    PLoc extends string[] = P extends 'root' ? [] : GetDocT<P>['__loc__'],
    POptions = GetDeep<S, PLoc>
  >(
    parent: P,
    collectionPath: C,
  ) => {
    const parentOrRoot = (parent === 'root'
      ? instance
      : parent) as P extends 'root' ? F : FireTypes.DocumentRef<GetDocT<P>, F>

    const parentLoc =
      parent === 'root'
        ? ([] as [])
        : (getLoc(parent as Exclude<typeof parent, 'root'>) as GetDocT<
            P
          >['__loc__'])

    const parentOptions = (getDeep(schema, parentLoc) as unknown) as POptions
    const collectionOptions = parentOptions[collectionPath]

    const collectionRef = parentOrRoot.collection(
      collectionPath,
    ) as POptions[C] extends Fireschema.CollectionOptions.Meta
      ? FireTypes.CollectionRef<
          GetOptionsType<POptions[C][typeof $schema]> &
            DocumentSchemaLoc<[...PLoc, C]>,
          F
        >
      : never

    return { ref: collectionRef }
  }

  return initCollection
}
