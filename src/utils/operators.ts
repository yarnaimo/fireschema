import { STypes } from '../firestore/STypes'
import { R } from '../lib/fp'

const $join = (separator: string, newline = false) => (
  conditions: STypes.ConditionExp[],
) => {
  const uniqConditions = R.uniq(conditions)

  return uniqConditions.length === 0
    ? 'true'
    : uniqConditions.length === 1
    ? uniqConditions.join(separator)
    : newline
    ? `(\n${uniqConditions.join(separator)}\n)`
    : `(${uniqConditions.join(separator)})`
}

export const $or = $join(' || ')
export const $and = $join(' && ')
export const $$or = $join('\n  || ', true)
export const $$and = $join('\n  && ', true)
