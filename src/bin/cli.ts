#!/usr/bin/env node

import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { register } from 'ts-node'

register({
  project: process.env.TS_NODE_PROJECT,
  compiler: 'ttypescript',
})

const rulesPath = 'firestore.rules'

const main = () => {
  const [, , path] = process.argv

  if (!path) {
    console.error('Schema path must be specified')
    process.exit(1)
  }

  const schemaModule = require(resolve(path)) // eslint-disable-line
  const rendererModule = require('../../src/firestore/_renderers/root') // eslint-disable-line

  const rendered = rendererModule.renderSchema(schemaModule.schema)

  writeFileSync(rulesPath, rendered)
  console.log('🎉 Generated firestore.rules')
}

main()
