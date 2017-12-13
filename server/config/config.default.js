module.exports = appInfo => {
  const config = {
    bodyParser: {
      jsonLimit: '500kb' // 不能再大了，再大接口实在太不合理了
    },
    mongoose: {
      url: 'mongodb://127.0.0.1/api-mock'
    },
    keys: `${appInfo.name}_1490324849354_6879`,
    // 密码加密的key
    md5Key: '52851cb05258c8d98da1672d95729e53',
    // 允许跨域携带cookie
    cors: {
      credentials: true
    },
    middleware: [ 'auth' ],
    // 邮件推送间隔
    pushInterval: {
      // 一个小时内修改api不会连续推送
      api: 1000 * 60 * 60
    },
    // 发送邮件配置
    transporter: {
      appName: 'Api Mocker',
      host: 'smtp.exmail.qq.com',
      secure: true,
      port: 465,
      auth: {
        user: 'dxyf2e@dxy.cn',
        pass: 'Dxyf2e222'
      }
    }
  }
  return config
}
