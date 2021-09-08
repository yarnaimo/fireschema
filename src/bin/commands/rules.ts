import { writeFileSync } from 'fs'
import { relative, resolve } from 'path'

const rulesPath = 'firestore.rules'

const relativePath = relative(process.cwd(), __dirname)
const isInsideNodeModules = relativePath.startsWith('node_modules/')

export const generateRules = async (path: string) => {
  const schemaPath = resolve(path)
  const schemaModule = await import(schemaPath)

  const rendererPath = isInsideNodeModules
    ? '../../../esm/core/firestore/_renderer/root'
    : '../../../src/core/firestore/_renderer/root'
  const rendererModule = await import(rendererPath)

  const rendered = rendererModule.renderSchema(
    schemaModule.default.default || schemaModule.default,
  )

  writeFileSync(rulesPath, rendered)
  console.log('🎉 Generated firestore.rules')
}
