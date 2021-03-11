// const path = require('path')
process.env.NODE_ENV = 'production'

require('egg').startCluster({
  // 若需要https服务，请取消注释，并配置好证书文件
  https: false,
  baseDir: __dirname,
  workers: 4,
  port: 7001 // default to 7001
})
