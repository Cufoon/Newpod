module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 'latest'
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      env: { node: true, es2021: true },
      files: ['.eslintrc.js']
    },
    {
      env: {
        node: true,
        es2021: true
      },
      files: ['webpack/**/*'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script'
      },
      plugins: ['@typescript-eslint', 'react'],
      rules: {
        semi: ['error', 'always'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'linebreak-style': ['error', 'unix']
      }
    },
    {
      env: {
        browser: true,
        es2021: true
      },
      files: ['src/**/*', '*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: 'react-jsx'
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint', 'react'],
      rules: {
        semi: ['error', 'always'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'linebreak-style': ['error', 'unix'],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off'
      }
    }
  ]
};
