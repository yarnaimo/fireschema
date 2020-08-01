import { STypes } from '../firestore/Fireschema'

const $join = (separator: string) => (conditions: STypes.ConditionExp[]) => {
  return conditions.length === 0
    ? 'true'
    : conditions.length === 1
    ? conditions.join(separator)
    : `(${conditions.join(separator)})`
}

export const $or = $join(' || ')
export const $and = $join(' && ')
