#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'

const devCliPath = resolve('src/cli/rules.ts')
const installedCliPath = resolve('node_modules/fireschema/src/cli/rules.ts')
const tsNode = './node_modules/.bin/ts-node --compiler ttypescript'

const main = () => {
  const [, , path] = process.argv

  const cliPath = existsSync(devCliPath)
    ? devCliPath
    : existsSync(installedCliPath)
    ? installedCliPath
    : null

  if (!cliPath) {
    console.error('Fireschema cli not found')
    process.exit(1)
  }

  execSync(`${tsNode} ${cliPath} ${path}`, {
    stdio: 'inherit',
    env: process.env,
  })
}

main()
