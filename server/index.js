const path = require('path')

require('egg').startCluster({
  https: true,
  key: path.join(__dirname, '../192.168.200.206.key'),
  cert: path.join(__dirname, '../192.168.200.206.crt'),
  baseDir: __dirname,
  workers: 4,
  port: process.env.PORT || 7001 // default to 7001
})

// https 链接走 ngnix转发
// require('egg').startCluster({
//     https: false,
//     baseDir: __dirname,
//     port: process.env.PORT || 7001 // default to 7001
// });
