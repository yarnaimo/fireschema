import { R } from '../../lib/fp.js'
import { STypes } from '../types/index.js'

const $join =
  (separator: string, newline = false) =>
  (...conditions: STypes.ConditionExp[]) => {
    const uniqConditions = R.uniq(conditions)

    return uniqConditions.length === 0
      ? 'true'
      : uniqConditions.length === 1
      ? uniqConditions.join(separator)
      : newline
      ? `(\n${uniqConditions.join(separator)}\n)`
      : `(${uniqConditions.join(separator)})`
  }

export const rules = {
  or: $join(' || '),
  and: $join(' && '),
  orMultiline: $join('\n  || ', true),
  andMultiline: $join('\n  && ', true),

  basePath: '/databases/$(database)/documents' as const,
}
