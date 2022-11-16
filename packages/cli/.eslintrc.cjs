/**
 * ESLint configuration
 * @see https://eslint.org/docs/latest/user-guide/configuring/
 * @see https://eslint.org/docs/latest/rules/
 */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'eslint:recommended',
  ignorePatterns: [
    '**/quire/versions/'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': [
      'error', 2,
      {
        'SwitchCase': 1 ,
        'VariableDeclarator': 'first'
      },
    ],
    'linebreak-style': [ 'error', 'unix' ],
    'quotes': [ 'error', 'single', { 'allowTemplateLiterals': true } ],
    'no-console': 'off',
    'no-unused-vars': [
      'warn',
      {
        'args': 'none',
        'ignoreRestSiblings': true
      }
    ],
    'semi': [ 'error', 'never' ],
    'sort-imports': [
      'warn',
      {
        'allowSeparatedGroups': false,
        'ignoreCase': false,
        'ignoreDeclarationSort': false,
        'ignoreMemberSort': false,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
      }
    ],
  }
}
