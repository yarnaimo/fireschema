import { dirname, resolve } from 'path'

import { readPackageUp } from 'read-pkg-up'

// eslint-disable-next-line import/extensions
import { createFile } from './../../core/utils/_createFile'

const dartsPath = './outputs/fireschema.dart'

export const generateDart = async (path: string) => {
  const pkg = await readPackageUp({ cwd: dirname(path) })
  const isEsm = pkg?.packageJson.type === 'module'

  const schemaPath = resolve(path)
  const schemaModule = await import(schemaPath)

  const srcDir = isEsm
    ? '../..' // esm/src/bin/commands to esm/src
    : '../../../../dist/src' // esm/src/bin/commands to dist/src
  const rendererPath = `${srcDir}/core/firestore/_renderer/root_dart.js`
  const rendererModule = await import(rendererPath)

  const rendered = rendererModule.renderSchema(
    schemaModule.default.default || schemaModule.default,
  )

  createFile(rendered, dartsPath)
  console.log('🎉 Generated dart!')
}
