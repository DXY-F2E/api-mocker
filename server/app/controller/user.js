const md5 = require('blueimp-md5')
module.exports = app => {
    class UserController extends app.Controller {
        * sentResetPassCode() {
            const { email } = this.ctx.request.body
            const user = yield this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const key = 'password_' + user._id
            const hasCode = this.service.cache.has(key)
            if (hasCode) {
                this.error('请勿重复发送')
            }
            const code = this.service.cache.verifyCodeCache(key, 6)
            const rs = yield this.service.email.resetPassword(code, user)
            if (rs && rs.messageId) {
                this.success(true);
            } else {
                this.error('发送验证码失败，请重试')
            }
        }
        * sentResetPassTicket() {
            const { email } = this.ctx.request.body
            const user = yield this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const ticket = this.service.ticket.create(user._id, 'password')
            const rs = yield this.service.email.passwordTicket(ticket, user)
            if (rs && rs.messageId) {
                this.success(true);
            } else {
                this.error('发送邮件失败，请重试')
            }
        }
        * resetPasswordByTicket() {
            const { email, password, ticket } = this.ctx.request.body
            const user = yield this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const encode = this.service.ticket.check(ticket, 'password', user._id.toString(), user.modifiedTime)
            if (!encode.success) {
                this.error(encode.msg)
            }
            const rs = yield this.service.user.updatePassword(email, password)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.success(true)
        }
        * resetPassword() {
            const { email, password, verifyCode } = this.ctx.request.body
            const user = yield this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const key = 'password_' + user._id
            const correctCode = this.service.cache.get(key)
            if (correctCode !== verifyCode) {
                this.ctx.logger.info('verifyCode error', `correctCode: ${correctCode}，verifyCode: ${verifyCode}`)
                this.error('验证码错误')
            }
            const rs = yield this.service.user.updatePassword(email, password)
            if (!rs) {
                this.error('修改失败', 500)
            }
            this.service.cache.del(key)
            this.success(true)
        }
        * get() {
            const rs = this.service.cookie.getUser()
            if (!rs || !rs._id) {
                this.error({
                    code: 401,
                    msg: '未登录'
                })
            }
            const user = yield this.service.user.getById(rs._id)
            if (user.modifiedTime > new Date(rs.modifiedTime)) {
                this.error({
                    code: 401,
                    msg: '信息已发生变更，请重新登录'
                })
            }
            this.success(rs)
        }
        * create() {
            const info = this.ctx.request.body
            const user = yield this.service.user.getByEmail(info.email)
            if (user) {
                this.error('此邮箱已被注册')
            }
            const rs = yield this.service.user.create(info)
            delete rs.password
            this.service.cookie.setUser(rs)
            this.success(rs)
        }
        * login() {
            const info = this.ctx.request.body
            const user = yield this.service.user.getByEmail(info.email)
            if (!user) {
                this.error('账号不存在')
            }
            if (user.password !== md5(info.password, this.config.md5Key)) {
                this.error('密码错误')
            }
            delete user.password
            this.service.cookie.setUser(user)
            this.success(user)
        }
        * update() {
            const user = this.ctx.request.body
            const rs = yield this.service.user.update(user)
            if (!rs) {
                this.error({
                    code: 500,
                    msg: '修改失败'
                })
            }
            delete rs.password
            this.service.cookie.setUser(rs)
            this.success(rs)
        }
        logout() {
            this.service.cookie.clearUser()
            this.success('注销成功')
        }
    }
    return UserController
}
