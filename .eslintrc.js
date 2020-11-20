/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: '@yarnaimo',
  parserOptions: {
    project: `./tsconfig.json`,
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['remeda', '@sindresorhus/is', 'firebase'],
        patterns: ['**/__mocks__/**'],
      },
    ],
  },
}

module.exports = config
