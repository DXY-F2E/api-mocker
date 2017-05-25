// npm run dev DO NOT read this file
// require('egg').startCluster({
//     https: true,
//     key: '../192.168.200.206.key',
//     cert: '../192.168.200.206.crt',
//     baseDir: __dirname,
//     port: process.env.PORT || 7001 // default to 7001
// });

// https 链接走 ngnix转发
require('egg').startCluster({
    https: false,
    baseDir: __dirname,
    port: process.env.PORT || 7001 // default to 7001
});
