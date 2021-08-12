module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts?(x)'],
  coveragePathIgnorePatterns: ['/__tests__/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/'],
  testRegex: '((\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^~/(.+)': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  resolver: './jest.resolver.cjs',
}
