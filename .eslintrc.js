module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'testing-library'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'eslint:recommended', 'plugin:testing-library/react', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
