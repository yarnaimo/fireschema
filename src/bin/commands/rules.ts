import { dirname, resolve } from 'path'

import { readPackageUp } from 'read-pkg-up'

// eslint-disable-next-line import/extensions
import { createFile } from './../../core/utils/_createFile'

const rulesPath = './outputs/firestore.rules'

export const generateRules = async (path: string, filePath: string) => {
  const pkg = await readPackageUp({ cwd: dirname(path) })
  const isEsm = pkg?.packageJson.type === 'module'
  const rulesPath_ = filePath === undefined ? rulesPath : filePath

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

  createFile(rendered, rulesPath_)
  console.log('🎉 Generated firestore.rules')
}
