module.exports = {
  extends: [
    'piecioshka',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],

  plugins: ['smells', 'import', 'todo-with-label', 'jsdoc'],

  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    // amd: true,
    // mocha: true,
    // jasmine: true,
    // jquery: true,
  },

  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],

  // https://eslint.org/docs/rules/
  rules: {
    indent: ['error', 2],
    'no-magic-numbers': 'off',
    'require-jsdoc': 'off',
    'default-case': 'off',
    'object-curly-newline': 'off',
    'no-console': 'off',
    'no-undefined': 'off',
    'id-blacklist': 'off',
    'valid-jsdoc': 'off',

    'smells/no-switch': 'off',
    'smells/no-complex-switch-case': 'error',
    'smells/no-setinterval': 'off',
    'smells/no-this-assign': 'error',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': 'error',

    'todo-with-label/has-valid-pattern': 'error',

    // TypeScript already documents parameters and return types.
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
  },

  // List of global variables.
  globals: {},

  parserOptions: {
    // Optional chaining and nullish coalescing are used throughout.
    ecmaVersion: 2022,

    // Support syntax ES2015 Import/Export
    sourceType: 'module',
  },
};
