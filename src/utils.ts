import { is } from './lib/type'
import { Fireschema } from './types'

export const $functions = Symbol('Fireschema - functions')
export const $schema = Symbol('Fireschema - schema')
export const $docLabel = Symbol('Fireschema - docLabel')
export const $allow = Symbol('Fireschema - allow')

export const $or = (conditions: Fireschema.ConditionExp[]) =>
  is.emptyArray(conditions) ? 'true' : `(${conditions.join(' || ')})`

export const $and = (conditions: Fireschema.ConditionExp[]) =>
  is.emptyArray(conditions) ? 'true' : `(${conditions.join(' && ')})`
