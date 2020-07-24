import { Fireschema } from './types/fireschema'

export const $functions = Symbol('Fireschema - functions')
export const $schema = Symbol('Fireschema - schema')
export const $adapter = Symbol('Fireschema - adapter')
export const $docLabel = Symbol('Fireschema - docLabel')
export const $allow = Symbol('Fireschema - allow')

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
