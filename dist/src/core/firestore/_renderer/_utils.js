'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.parseSchemaOptions = void 0
const lifts_1 = require('lifts')
const fp_js_1 = require('../../../lib/fp.js')
const parseSchemaOptions = (options) => {
  const entries = Object.entries(options)
  const functions = (0, lifts_1.P)(
    entries,
    fp_js_1.R.flatMap(([k, v]) =>
      k.startsWith('function ') ? [[k.replace('function ', ''), v]] : [],
    ),
    (filtered) => (filtered.length ? Object.fromEntries(filtered) : undefined),
  )
  const collections = Object.fromEntries(
    entries.filter(([k]) => k.includes('/')),
  )
  return { functions, collections }
}
exports.parseSchemaOptions = parseSchemaOptions
