import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'

import reactHooksPlugin from 'eslint-plugin-react-hooks'

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

import reactRefresh from 'eslint-plugin-react-refresh'

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactRefresh.configs.vite,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooksPlugin.configs['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist', '.eslintrc.cjs'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    rules: {
      semi: ['error', 'never'],
      'import/order': 'warn',
      'react-refresh/only-export-components': 'warn',
      'react/no-unescaped-entities': 'off',
    },
    settings: {
      react: {
        version: 'detect',
        defaultVersion: '18',
      },
      'import/resolver': {
        typescript: true,
      },
    },
  },
])
