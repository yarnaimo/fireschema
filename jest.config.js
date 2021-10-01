import { readFileSync } from 'fs'
import globby from 'globby'
import { basename, dirname } from 'path'

const esmPackages = globby
  .sync('**/node_modules/*/package.json')
  .flatMap((packageJsonPath) => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    return packageJson.type === 'module' && !packageJson.main
      ? [basename(dirname(packageJsonPath))]
      : []
  })

export default /** @type {import('@jest/types').Config.InitialOptions} */ ({
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts?(x)'],
  coveragePathIgnorePatterns: ['/__tests__/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/'],
  testRegex: '((\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.(js|tsx?)$': ['@swc/jest', { jsc: { target: 'es2021' } }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [`node_modules/(?!${esmPackages.join('|')})`],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  resolver: '@yarnaimo/jest-esm-resolver',
})
