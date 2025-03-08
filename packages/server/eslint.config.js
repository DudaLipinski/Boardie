import importPlugin from 'eslint-plugin-import'

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist', 'node_modules'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    rules: {
      semi: ['error', 'never'],
      'import/order': 'warn',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
])
