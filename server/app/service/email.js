const nodemailer = require('nodemailer')
const Service = require('egg').Service

class Email extends Service {
  constructor (...args) {
    super(...args)
    this.transporter = nodemailer.createTransport(this.config.transporter)
  }
  sent (to, subject, html) {
    const { auth, appName } = this.config.transporter
    const mailOptions = {
      from: `${appName} <${auth.user}>`,
      to,
      subject,
      html
    }
    return this.transporter.sendMail(mailOptions).catch(error => {
      this.ctx.logger.info('Message %s sent error: %s', error)
      return error
    })
  }
  resetPassword (verifyCode, user) {
    const html = `
      <strong>重设密码</strong>
      <p>账户名：${user.name}</p>
      <p>验证码：${verifyCode}</p>
    `
    return this.sent(user.email, 'Api Mocker 找回密码', html)
  }
  passwordTicket (ticket, user) {
    const html = `
      <strong>找回密码</strong>
      <p>账户名：${user.name}</p>
      <p>链接：${this.config.clientRoot}/#/reset-pass?ticket=${ticket}</p>
    `
    return this.sent(user.email, 'Api Mocker 找回密码', html)
  }
  getApiDocUrl (api) {
    return `${this.config.clientRoot}/#/doc/${api.group}/${api._id}`
  }
  notifyApiCreate (group, api, users) {
    const html = `
      <strong>API：${api.name}</strong>
      <p>分组：${group.name} </p>
      <p>创建者：${this.ctx.authUser.name}</p>
      <p>链接地址：${this.getApiDocUrl(api)}</p>
    `
    users.forEach(user => this.sent(user.email, 'Api Mocker 接口新增提醒', html))
  }
  notifyApiDelete (group, api, users) {
    const html = `
      <strong>API：${api.name}</strong>
      <p>分组：${group.name} </p>
      <p>删除者：${this.ctx.authUser.name}</p>
      <p>链接地址：${this.getApiDocUrl(api)}</p>
    `
    users.forEach(user => this.sent(user.email, 'Api Mocker 接口删除提醒', html))
  }
  notifyApiChange (api, users) {
    const html = `
      <strong>API：${api.name}</strong>
      <p>修改者：${this.ctx.authUser.name}</p>
      <p>链接地址：${this.getApiDocUrl(api)}</p>
    `
    users.forEach(user => this.sent(user.email, 'Api Mocker 接口变动提醒', html))
  }
}

module.exports = Email
