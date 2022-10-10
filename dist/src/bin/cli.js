'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.cli = void 0
const getopts_1 = require('getopts')
const export_js_1 = require('./commands/export.js')
const rules_js_1 = require('./commands/rules.js')
const help = `Usage:
fireschema rules <schema-path>          generate firestore.rules
fireschema export <functions-dir-path>  create functions entrypoint file`
const cli = async () => {
  const {
    _: [command, ...args],
    esm,
    output,
  } = (0, getopts_1.default)(process.argv.slice(2), {
    alias: { output: 'o' },
    boolean: ['esm'],
  })
  switch (command) {
    case 'rules':
      if (!args[0]) {
        console.error('Schema path must be specified')
        process.exit(1)
      }
      void (0, rules_js_1.generateRules)(args[0])
      break
    case 'export':
      if (!args[0]) {
        console.error('A target directory must be specified')
        process.exit(1)
      }
      void (0, export_js_1.exportFunctions)(args[0], esm, output)
      break
    case '--help':
      console.log(help)
      break
    default:
      console.log(help)
      process.exit(1)
  }
}
exports.cli = cli
