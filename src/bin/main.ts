#!/usr/bin/env node

import { register } from 'ts-node'
import { exportFunctions } from './export'
import { generateRules } from './rules'

register({
  project: process.env['TS_NODE_PROJECT'],
  files: true,
})

const help = `Usage:
fireschema rules <schema-path>          generate firestore.rules
fireschema export <functions-dir-path>  create functions entrypoint file`

const [, , command, ...args] = process.argv

switch (command) {
  case 'rules':
    if (!args[0]) {
      console.error('Schema path must be specified')
      process.exit(1)
    }
    generateRules(args[0])
    break

  case 'export':
    if (!args[0]) {
      console.error('A target directory must be specified')
      process.exit(1)
    }
    void exportFunctions(args[0])
    break

  case '--help':
    console.log(help)
    break

  default:
    console.log(help)
    process.exit(1)
}
