#! ./node_modules/.bin/ts-node

import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { renderSchema } from '../firestore/_renderers/root'

const rulesPath = 'firestore.rules'

const main = async () => {
  const [, , path] = process.argv
  if (!path) {
    console.error('Schema path must be specified')
    return
  }

  const absolutePath = resolve(path)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const schemaModule = require(absolutePath)
  const rendered = renderSchema(schemaModule.schema)

  writeFileSync(rulesPath, rendered)
}

main()
