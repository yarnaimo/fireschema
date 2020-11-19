import { R } from '../../lib/fp'
import { STypes } from '../types'

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
