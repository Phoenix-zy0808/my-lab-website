import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: true,
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/public/**',
      '**/*.md',
      '**/*.log',
      '.git/**',
      '.qwen/**',
      'auto-imports.d.ts',
      'components.d.ts',
    ],
  },
)
