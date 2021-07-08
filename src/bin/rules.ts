#!/usr/bin/env node

import { writeFileSync } from 'fs'
import { relative, resolve } from 'path'

const rulesPath = 'firestore.rules'
const relativePath = relative(process.cwd(), __dirname)
const isInsideNodeModules = relativePath.startsWith('node_modules/')

export const generateRules = (path: string) => {
  const schemaPath = resolve(path)
  const schemaModule = require(schemaPath) // eslint-disable-line

  const rendererPath = isInsideNodeModules
    ? '../../dist/core/firestore/_renderer/root'
    : '../../src/core/firestore/_renderer/root'
  const rendererModule = require(rendererPath) // eslint-disable-line

  const rendered = rendererModule.renderSchema(schemaModule.firestoreSchema)

  writeFileSync(rulesPath, rendered)
  console.log('🎉 Generated firestore.rules')
}
