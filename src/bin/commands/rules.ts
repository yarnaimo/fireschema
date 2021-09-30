import { readFileSync, writeFileSync } from 'fs'
import { relative, resolve } from 'path'

const rulesPath = 'firestore.rules'

const relativePath = relative(process.cwd(), __dirname)
const isDev = !relativePath.startsWith('node_modules/')

export const generateRules = async (path: string) => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const isEsm = (packageJson.type === 'module') as boolean

  const schemaPath = resolve(path)
  const schemaModule = await import(schemaPath)

  const rendererPath = isDev
    ? '../../../src/core/firestore/_renderer/root.js'
    : isEsm
    ? '../../../esm/src/core/firestore/_renderer/root.js'
    : '../../../dist/src/core/firestore/_renderer/root.cjs'
  const rendererModule = await import(rendererPath)

  const rendered = rendererModule.renderSchema(
    schemaModule.default.default || schemaModule.default,
  )

  writeFileSync(rulesPath, rendered)
  console.log('🎉 Generated firestore.rules')
}
