// npm run dev DO NOT read this file
require('egg').startCluster({
    https: false,
    key: '../domain.key',
    cert: '../domain.cert',
    baseDir: __dirname,
    port: process.env.PORT || 7001 // default to 7001
});
