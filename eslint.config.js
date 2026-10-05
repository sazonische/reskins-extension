import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const UNTRUSTED_HTML_MESSAGE = 'Steam DOM is untrusted: build elements with createElement and textContent.';

export default defineConfig(
  { ignores: ['.output/', '.wxt/'] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // full words only; `id` is the one short term that is not three letters
      'id-length': ['error', { min: 3, exceptions: ['id'], properties: 'never' }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'forbid', trailingUnderscore: 'forbid' },
        { selector: 'variable', modifiers: ['const'], format: ['camelCase', 'UPPER_CASE'] },
        { selector: ['variable', 'parameter'], types: ['boolean'], format: ['PascalCase'], prefix: ['is', 'has', 'can', 'should'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        // manifest keys and DOM option names are not ours to name
        { selector: 'objectLiteralProperty', format: null },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['error', { allow: ['warn'] }],
      'no-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: UNTRUSTED_HTML_MESSAGE },
        { property: 'outerHTML', message: UNTRUSTED_HTML_MESSAGE },
        { property: 'insertAdjacentHTML', message: UNTRUSTED_HTML_MESSAGE },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
