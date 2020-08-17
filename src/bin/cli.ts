#!/usr/bin/env node

import { writeFileSync } from 'fs'
import { relative, resolve } from 'path'
import { register } from 'ts-node'

register({
  project: process.env.TS_NODE_PROJECT,
  compiler: 'ttypescript',
})

const rulesPath = 'firestore.rules'
const relativePath = relative(process.cwd(), __dirname)
const isInsideNodeModules = relativePath.startsWith('node_modules/')

const main = () => {
  const [, , path] = process.argv

  if (!path) {
    console.error('Schema path must be specified')
    process.exit(1)
  }

  const schemaPath = resolve(path)
  const schemaModule = require(schemaPath) // eslint-disable-line

  const rendererPath = isInsideNodeModules
    ? '../../dist/firestore/_renderers/root'
    : '../../src/firestore/_renderers/root'
  const rendererModule = require(rendererPath) // eslint-disable-line

  const rendered = rendererModule.renderSchema(schemaModule.firestoreSchema)

  writeFileSync(rulesPath, rendered)
  console.log('🎉 Generated firestore.rules')
}

main()
