// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import baseConfig from '@peculiar/eslint-config-base';
import reactConfig from '@peculiar/eslint-config-react';

export default tseslint.config([
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      'import/no-unresolved': ['error', { ignore: ['\\.svg\\?react$'] }],
      'react/no-array-index-key': 'off',
    },
  },
  {
    settings: { 'import/core-modules': ['@testing', '@testing/data'] },
    ignores: [
      '**/dist/*',
      '**/public/*',
    ],
  },
]);
