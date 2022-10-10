'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.TypedCaller = void 0
const functions_1 = require('firebase/functions')
const type_js_1 = require('../../../lib/type.js')
const encode = (data) => {
  return Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      if (value === undefined) {
        return []
      }
      if (!type_js_1.is.array(value) && type_js_1.is.object(value)) {
        return [[key, encode(value)]]
      }
      return [[key, value]]
    }),
  )
}
class TypedCaller {
  constructor(functionsApp) {
    Object.defineProperty(this, 'functionsApp', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: functionsApp,
    })
  }
  async call(functionPath, data, options) {
    const name = ['callable', functionPath].join('-')
    const callable = (0, functions_1.httpsCallable)(
      this.functionsApp,
      name,
      options,
    )
    try {
      const result = await callable(encode(data))
      return {
        data: result.data,
      }
    } catch (error) {
      return { error: error }
    }
  }
}
exports.TypedCaller = TypedCaller
