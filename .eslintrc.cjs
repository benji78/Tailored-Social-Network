module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    project: './tsconfig.json',
  },
  plugins: ['react', 'react-refresh', 'import', '@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'import/newline-after-import': ['error', { count: 1 }],
     "react/jsx-uses-react": "off",
     "react/react-in-jsx-scope": "off",
  },
  reportUnusedDisableDirectives: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
}
