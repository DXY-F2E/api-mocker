// mongo 数据库配置
module.exports = config => ({
  // mongo 配置
  mongoose: {
    url: 'mongodb://127.0.0.1/api-mock'
  },
  // 密码加密的key
  md5Key: 'xxx',
  // 发送邮件配置
  transporter: {
    appName: 'Api Mocker',
    host: 'smtp.exmail.qq.com',
    secure: true,
    port: 465,
    auth: {
      user: 'xxx@dxy.cn',
      pass: 'xxx'
    }
  }
})
