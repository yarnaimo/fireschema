/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: '@yarnaimo',
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['remeda', '@sindresorhus/is', 'type-fest', 'firebase'],
        patterns: ['**/__mocks__/**'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}

module.exports = config
