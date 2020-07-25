import { $adapter, $schema } from '../constants/symbols'
import { Fireschema } from '../types/Fireschema'
import { FireTypes } from '../types/FireTypes'
import { fadmin, fweb } from '../types/_firestore'
import { getDeep, GetDeep } from '../types/_object'

const getLoc = (parentOrRoot: FireTypes.DocumentRef<unknown>) =>
  parentOrRoot.path.split('/').filter((_, i) => i % 2 === 0)

type DocumentSchemaLoc<L extends string[]> = {
  __loc__: L
}

type GetDocT<
  D extends 'root' | FireTypes.DocumentRef<unknown>
> = D extends FireTypes.DocumentRef<infer T> ? T : never

type GetOptionsT<
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
  const collection = <
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

    type Options = POptions[C]
    const collectionOptions = parentOptions[collectionPath] as Options

    const collectionRef = parentOrRoot.collection(
      collectionPath,
    ) as Options extends Fireschema.CollectionOptions.Meta
      ? FireTypes.CollectionRef<
          GetOptionsT<Options[typeof $schema]> &
            DocumentSchemaLoc<[...PLoc, C]>,
          F
        >
      : never

    const adapter = (collectionOptions as any)[$adapter]
    // as Options extends Fireschema.CollectionOptions.Meta
    //   ? Options[typeof $adapter]
    //   : never

    const adapted = adapter(collectionRef)
    // as Options[typeof $adapter] extends Fireschema.Adapter<
    //   infer _,
    //   infer SL,
    //   infer _
    // >
    //   ? Fireschema.Adapted<SL, F>
    //   : never

    const select = adapted.select as Options extends Fireschema.CollectionOptions.Meta
      ? Fireschema.Selectors<Options[typeof $adapter]['__SL__'], F>
      : never

    // const select = adapted.select as typeof adapted extends Fireschema.Adapted<
    //   // infer _,
    //   infer SL,
    //   infer _
    // >
    //   ? typeof adapted['__SL__']
    //   : never

    return {
      ref: collectionRef,
      select,
    }
  }

  return { collection }
}
