// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // 取消promise必须返回error类型
    'prefer-promise-reject-errors': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 'linebreak-style': ['error', process.env.NODE_ENV === 'prod' ? 'unix' : 'windows'], // windows机器eslint换行问题，得加该行
    'arrow-body-style': ['error', 'as-needed']
  }
}
