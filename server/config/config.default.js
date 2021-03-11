const core = require('./core.default')
const coreConfig = core()

module.exports = appInfo => {
  const config = {
    bodyParser: {
      jsonLimit: '5mb' // 不能再大了，再大接口实在太不合理了
    },
    keys: `${appInfo.name}_1490324849354_6879`,
    // 允许跨域携带cookie
    cors: {
      credentials: true
    },
    security: {
      csrf: {
        enable: false
      },
      domainWhiteList: [ '*' ]
    },
    middleware: ['auth'],
    // 邮件推送间隔
    pushInterval: {
      // 一个小时内修改api不会连续推送
      api: 1000 * 60 * 60
    },
    httpclient: {
      request: {
        timeout: 1000 * 60 * 5
      }
    },
    multipart: {
      fileSize: '500Mb',
      mode: 'stream'
    },
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.tpl': 'nunjucks'
      }
    },
    ...coreConfig
  }
  return config
}
