module.exports = {
  env: {
    jest: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'jest',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    // 'max-len': { code: 120 },
    'no-use-before-define': 'off',
  },
};
