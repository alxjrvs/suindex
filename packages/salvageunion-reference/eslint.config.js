import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { baseConfig } from '../../eslint.config.base.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'lib/*.template.ts', 'tools/**'],
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  },
]
