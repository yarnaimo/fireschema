/* Auto generated by fireschema */

import type * as __callable_test___ from './callable/test_.js'

const importModule = (functionNames: string[], modulePath: string) => {
  return !process.env['FUNCTION_NAME'] ||
    functionNames.includes(process.env['FUNCTION_NAME'])
    ? require(modulePath)
    : undefined
}

export const callable = {
  ...importModule(['callable-test'], './callable/test_'),
}

export type FunctionsModule = {
  callable: typeof __callable_test___
}
