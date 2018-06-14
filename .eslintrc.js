module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['prettier'],
  extends: ['prettier', 'eslint:recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: false,
        printWidth: 100,
      },
    ],
    'brace-style': ['error', '1tbs', {allowSingleLine: false}],
    'max-len': ['error', 100],
    'no-unused-expressions': 'error',
    'object-curly-spacing': ['error', 'never'],
    quotes: ['error', 'single', {avoidEscape: true}],
    'keyword-spacing': ['error', {before: true}],
    'space-in-parens': ['error', 'never'],
    semi: ['error', 'always'],
    'space-unary-ops': ['error', {nonwords: false}],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-expressions': ["error", { "allowTernary": true }],
  },
  overrides: [
    {
      // chai uses some expressions like `to.be.ok` which are valid syntax
      // but get caught by this rule.
      files: '*-test.js',
      rules: {
        "no-unused-expressions": 'off'
      }
    }, {
      // node files
      files: [
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
      ],
    }
  ],
  globals: {
    "Raven": true
  }
};
