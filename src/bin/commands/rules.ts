import { writeFileSync } from 'fs'
import { dirname, resolve } from 'path'

import { readPackageUp } from 'read-pkg-up'

const rulesPath = 'firestore.rules'

export const generateRules = async (path: string) => {
  const pkg = await readPackageUp({ cwd: dirname(path) })
  const isEsm = pkg?.packageJson.type === 'module'

  const schemaPath = resolve(path)
  const schemaModule = await import(schemaPath)

  const srcDir = isEsm
    ? '../..' // esm/src/bin/commands to esm/src
    : '../../../../dist/src' // esm/src/bin/commands to dist/src
  const rendererPath = `${srcDir}/core/firestore/_renderer/root.js`
  const rendererModule = await import(rendererPath)

  const rendered = rendererModule.renderSchema(
    schemaModule.default.default || schemaModule.default,
  )

  writeFileSync(rulesPath, rendered)
  console.log('🎉 Generated firestore.rules')
}
