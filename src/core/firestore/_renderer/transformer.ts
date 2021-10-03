import { P } from 'lifts'
import {
  ZodAny,
  ZodArray,
  ZodBoolean,
  ZodIntersection,
  ZodLiteral,
  ZodNull,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodString,
  ZodTuple,
  ZodTypeAny,
  ZodUndefined,
  ZodUnion,
  ZodUnknown,
  z,
} from 'zod'

import { R } from '../../../lib/fp.js'
import { is } from '../../../lib/type.js'
import { ZodTimestamp } from '../../types/SchemaType.js'
import { $$and, $and, $or } from '../../utils/index.js'

export const schemaToRuleWithMeta = (t: ZodTypeAny): string => {
  return $and([`__validator_meta__(data)`, _schemaToRule()(t)])
}

export const _schemaToRule =
  (parent: string | null = null, key: string | number = 'data') =>
  (t: ZodTypeAny): string => {
    const name = is.null_(parent)
      ? (key as string)
      : is.number(key)
      ? `${parent}[${key}]`
      : `${parent}.${key}`

    if (t instanceof ZodUnion)
      return P(t.options, R.map(_schemaToRule(parent, key)), $or)

    if (t instanceof ZodIntersection)
      return P(
        [t._def.left, t._def.right],
        R.map(_schemaToRule(parent, key)),
        $and,
      )

    if (t instanceof ZodOptional)
      return _schemaToRule(parent, key)(z.union([t.unwrap(), z.undefined()]))

    if (t instanceof ZodAny) return `true`
    if (t instanceof ZodUnknown) return `true`
    if (t instanceof ZodUndefined) return `!("${key}" in ${parent})`
    if (t instanceof ZodNull) return `${name} == null`
    if (t instanceof ZodBoolean) return `${name} is bool`
    if (t instanceof ZodLiteral) return `${name} == ${JSON.stringify(t.value)}`
    if (t instanceof ZodTimestamp) return `${name} is timestamp`

    if (t instanceof ZodString) {
      return $and([
        `${name} is string`,

        ...t._def.checks.flatMap((c) => {
          return c.kind === 'min'
            ? [`${name}.size() >= ${c.value}`]
            : c.kind === 'max'
            ? [`${name}.size() <= ${c.value}`]
            : c.kind === 'regex'
            ? [`${name}.matches(${JSON.stringify(c.regex.source)})`]
            : []
        }),
      ])
    }

    if (t instanceof ZodNumber) {
      return $and([
        t.isInt ? `${name} is int` : `${name} is number`,

        ...t._def.checks.flatMap((c) => {
          return c.kind === 'min'
            ? [`${name} >= ${c.value}`]
            : c.kind === 'max'
            ? [`${name} <= ${c.value}`]
            : []
        }),
      ])
    }

    if (t instanceof ZodArray) {
      const { minLength: min, maxLength: max } = t._def
      // const isEmpty = `${name}.size() == 0`

      return $and([
        `${name} is list`,
        // $or([isEmpty, _schemaToRule(name, 0)(t.element)]),

        ...[
          min && `${name}.size() >= ${min.value}`,
          max && `${name}.size() <= ${max.value}`,
        ].filter(is.string),
      ])
    }

    if (t instanceof ZodTuple) {
      return $and([
        `${name} is list`,

        ...(t.items as ZodTypeAny[]).map((_t, i) => {
          return _schemaToRule(name, i)(_t as any)
        }),
      ])
    }

    if (t instanceof ZodObject) {
      return P(
        Object.entries(t.shape),
        R.map(([key, _t]) => {
          return _schemaToRule(name, key)(_t as any)
        }),
        (rules) => {
          if (name !== 'data') {
            return rules
          }
          const keysArray = `[${Object.keys(t.shape)
            .map((k) => `'${k}'`)
            .join(', ')}]`
          return [`__validator_keys__(data, ${keysArray})`, ...rules]
        },
        name === 'data' ? $$and : $and,
      )
    }

    throw new Error(`unhandled type ${t.constructor.name} at ${name}`)
  }
