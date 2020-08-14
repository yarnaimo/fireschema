import { EntriesStrict, FromEntriesStrict, P, Switch } from 'lifts'
import { $array, hasArraySymbol, STypes } from '../../firestore'
import { R } from '../../lib/fp'
import { is } from '../../lib/type'
import { $ } from '../../runtypes'
import { arrayfy } from '../../utils/_array'

export const schemaToRuntype = (
  types: STypes.DataSchemaValueType<any>,
): $.Runtype<unknown> => {
  return P(
    types,
    arrayfy,
    R.map((type) => {
      if (hasArraySymbol(type)) {
        return $.Array(schemaToRuntype(type[$array]))
      }
      if (is.object(type)) {
        return P(
          type,
          EntriesStrict,
          R.map(([key, t]) => [key as string, schemaToRuntype(t)] as const),
          FromEntriesStrict,
          $.Record,
        )
      }
      return Switch(type)<$.Runtype<unknown>, never>(
        {
          null: () => $.Null,
          string: () => $.String,
          int: () => $.Number,
          float: () => $.Number,
          bool: () => $.Boolean,
          timestamp: () => $.Never,
          list: () => $.Array($.Unknown),
          map: () => $.Record({}),
        },
        () => null as never,
      )
    }),
    R.reduce<$.Runtype<unknown>, $.Runtype<unknown> | null>(
      (prev, cur) => (is.null_(prev) ? cur : prev.Or(cur)),
      null,
    ),
    (runtype) => runtype ?? $.Never,
  )
}
