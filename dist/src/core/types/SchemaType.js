'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.timestampType = exports.ZodTimestamp = void 0
const zod_1 = require('zod')
class ZodTimestamp extends zod_1.ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input)
    return (0, zod_1.OK)(ctx.data)
  }
}
exports.ZodTimestamp = ZodTimestamp
const timestampType = () => new ZodTimestamp({})
exports.timestampType = timestampType
