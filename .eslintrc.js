module.exports = {
  env: {
      browser: true,
      es2021: true
  },
  settings: {
      react: {
          version: 'detect'
      }
  },
  extends: [
      'standard',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
      ecmaFeatures: {
          jsx: true
      },
      ecmaVersion: 12,
      sourceType: 'module'
  },
  // plugins: ['react', '@typescript-eslint'],
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
      'no-use-before-define': [0, { functions: false, classes: false, variables: false }]
  }
};
