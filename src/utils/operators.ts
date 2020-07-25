import { Fireschema } from '../types/Fireschema'

const $join = (separator: string) => (
  conditions: Fireschema.ConditionExp[],
) => {
  return conditions.length === 0
    ? 'true'
    : conditions.length === 1
    ? conditions.join(separator)
    : `(${conditions.join(separator)})`
}

export const $or = $join(' || ')
export const $and = $join(' && ')
