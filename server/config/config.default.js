const core = require('./core')
const coreConfig = core()

module.exports = appInfo => {
  const config = {
    bodyParser: {
      jsonLimit: '500kb' // 不能再大了，再大接口实在太不合理了
    },
    keys: `${appInfo.name}_1490324849354_6879`,
    // 允许跨域携带cookie
    cors: {
      credentials: true
    },
    middleware: ['auth'],
    // 邮件推送间隔
    pushInterval: {
      // 一个小时内修改api不会连续推送
      api: 1000 * 60 * 60
    },
    ...coreConfig
  }
  return config
}
