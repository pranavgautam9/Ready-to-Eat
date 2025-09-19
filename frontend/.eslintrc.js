module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-template-curly-in-string': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  }
};
