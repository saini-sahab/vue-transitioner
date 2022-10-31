/* eslint-env node */
require( '@rushstack/eslint-patch/modern-module-resolution' )

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'indent': [ 'error', 2 ],
    'brace-style': [ 'error', '1tbs', { allowSingleLine: true } ],
    'space-in-parens': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'max-len': 'off',
    'vue/html-indent': [ 'warn', 2, {
      alignAttributesVertically: false
    } ],
  }
}
