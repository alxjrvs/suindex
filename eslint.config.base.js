import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/**
 * Base ESLint configuration shared across all packages
 * Extend this config in package-specific eslint.config.js files
 */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      semi: ['error', 'never'],
      'no-extra-semi': 'error',
    },
  },
]

