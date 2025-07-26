import { defineConfig, globalIgnores } from 'eslint/config'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const config = defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores([
    '**/.next/**',
    '**/dist/**',
    '**/out/**',
    '**/node_modules/**',
    '**/*.log',
    '**/*.tmp',
    '**/.vscode/**',
    '**/.idea/**',
    '**/.DS_Store',
  ]),
  {
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'eol-last': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
])

export default config
