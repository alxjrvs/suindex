import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { baseConfig } from '../../eslint.config.base.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  {
    ignores: [
      '.netlify',
      'dist',
      'node_modules',
      '.git',
      'coverage',
      'build',
      '.vite',
      'src/types/database-generated.types.ts',
      'src/routeTree.gen.ts',
    ],
  },
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['happydom.ts', 'testing-library.ts'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
    },
  },
  prettier,
]
