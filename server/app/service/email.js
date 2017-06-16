module.exports = app => {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport(app.config.transporter)
    class Email extends app.Service {
        sent(to, subject, html) {
            const {auth, appName} = this.config.transporter
            const mailOptions = {
                from: `${appName} <${auth.user}>`,
                to: to,
                subject: subject,
                html: html
            }
            return transporter.sendMail(mailOptions).catch(error => {
                this.ctx.logger.info('Message %s sent error: %s', error)
                return error
            })
        }
        resetPassword(verifyCode, user) {
            const html = `
                <strong>重设密码</strong>
                <p>账户名：${user.name}</p>
                <p>验证码：${verifyCode}</p>
            `
            return this.sent(user.email, 'Api Mocker 找回密码', html)
        }
        passwordTicket(ticket, user) {
            const html = `
                <strong>找回密码</strong>
                <p>账户名：${user.name}</p>
                <p>链接：${app.config.clientRoot}/#/reset-pass?ticket=${ticket}</p>
            `
            return this.sent(user.email, 'Api Mocker 找回密码', html)
        }
        notifyApiChange(api, users) {
            const html = `
                <strong>API：${api.name}</strong>
                <p>修改者：${this.ctx.authUser.name}</p>
                <p>链接地址：${app.config.clientRoot}/#/doc/${api.group}/${api._id}</p>
            `
            users.map(user => {
                this.sent(user.email, 'Api Mocker 接口变动提醒', html)
            })
        }
    }
    return Email;
};