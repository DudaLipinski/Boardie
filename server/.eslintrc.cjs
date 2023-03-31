module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    semi: ['error', 'never'],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/order': 'error',
    'import/no-unresolved': 'off',
    'no-redeclare': 'error',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
}
