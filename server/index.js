process.env.NODE_ENV = 'production'

require('egg').startCluster({
  // 若需要https服务，请取消注释，并配置好证书文件
  // https: true,
  // key: '{{key_file}}',
  // cert: '{{crt_file}}',
  baseDir: __dirname,
  workers: 4,
  port: process.env.PORT || 7001 // default to 7001
})
