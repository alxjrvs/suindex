import js from '@eslint/js'
import ts from 'typescript-eslint'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'lib/*.template.ts'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      semi: ['error', 'never'],
      'no-extra-semi': 'error',
    },
  },
]
