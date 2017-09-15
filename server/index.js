require('egg').startCluster({
  https: true,
  key: './certs/192.168.200.206.key',
  cert: './certs/192.168.200.206.crt',
  baseDir: __dirname,
  workers: 4,
  port: process.env.PORT || 7001 // default to 7001
})
