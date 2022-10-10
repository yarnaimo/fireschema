import { STypes } from '../index.js'
import { JoinLoc, OmitLastSegment, ParseLocString } from '../types/_object.js'
export declare const getDeep: (object: object, paths: string[]) => unknown
export declare const parseLocString: <L extends string>(
  loc: L,
) => ParseLocString<L>
export declare const getSchemaOptionsByLoc: (
  schemaOptions: STypes.RootOptions.All,
  loc: string,
) => STypes.CollectionOptions.Meta
export declare const getCollectionOptionsByName: (
  options: STypes.CollectionOptions.Children,
  targetCollectionName: string,
  _loc?: string,
) => {
  loc: string
  options: STypes.CollectionOptions.Meta
}[]
export declare const joinLoc: <T extends string, U extends string>(
  t: T,
  u: U,
) => JoinLoc<T, U>
export declare const getLastSegment: (loc: string) => string
export declare const omitLastSegment: <L extends string>(
  loc: L,
) => OmitLastSegment<L>
