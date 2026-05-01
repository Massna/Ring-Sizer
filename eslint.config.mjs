import { defineConfig, globalIgnores } from 'eslint/config'
import { tanstackConfig } from '@tanstack/eslint-config'
import convexPlugin from '@convex-dev/eslint-plugin'

export default defineConfig([
  ...tanstackConfig,
  ...convexPlugin.configs.recommended,
  globalIgnores(['convex/_generated']),
  {
    files: ['**/*.html', '**/package.json'],
    languageOptions: {
      parser: {
        parse() {
          const node = {
            type: 'Program',
            body: [],
            sourceType: 'module',
            range: [0, 0],
            tokens: [],
            comments: [],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          }
          return node
        },
      },
    },
    rules: {},
  },
])
