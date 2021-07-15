import { $or } from '.'

export const $rule = {
  notExists: (key: string | 0, parent: string | null) =>
    `!("${key}" in ${parent})`,

  isNull: (name: string) => `${name} == null`,

  isBool: (name: string) => `${name} is bool`,

  isLiteralOf: (name: string, literal: string) => `${name} == ${literal}`,

  isString: (name: string) => `${name} is string`,

  isNumber: (name: string) => $or([`${name} is int`, `${name} is float`]),
  isInt: (name: string) => `${name} is int`,
  isFloat: (name: string) => `${name} is float`,

  isTimestamp: (name: string) => `${name} is timestamp`,
  isServerTimestamp: (name: string) => `${name} == request.time`,

  isEmptyArray: (name: string) => `${name}.size() == 0`,
}
