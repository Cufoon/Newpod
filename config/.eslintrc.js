module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix']
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  root: true
};
