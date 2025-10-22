export default {
  '*.{ts,tsx,js,jsx}': ['next lint --fix --file', 'prettier --write'],
  '*.{json,md,css,scss}': ['prettier --write']
};
