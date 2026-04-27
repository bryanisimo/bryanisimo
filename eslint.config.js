import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Disable the "is declared but its value is never read" rule
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow `any` — used legitimately with Three.js, Vanta and Lightbox
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow declare global namespace for JSX intrinsic elements
      '@typescript-eslint/no-namespace': 'off',
    },
  },
)
