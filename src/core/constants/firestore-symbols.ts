export const $functions = Symbol('Fireschema - functions')
export const $schema = Symbol('Fireschema - schema')
export const $adapter = Symbol('Fireschema - adapter')
export const $collectionGroups = Symbol('Fireschema - collectionGroups')
export const $docLabel = Symbol('Fireschema - docLabel')
export const $allow = Symbol('Fireschema - allow')
export const $array = Symbol('Fireschema - array')
export const arrayKey = '__fireschema_array_key__'

export const hasArraySymbol = <T, U>(
  obj: T | { [$array]: U },
): obj is { [$array]: U } => Object.getOwnPropertySymbols(obj).includes($array)
