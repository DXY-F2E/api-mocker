const md5 = require('blueimp-md5')
module.exports = app => {
    class UserController extends app.Controller {
        * findPassword() {
            const { email } = this.ctx.request.body
            const user = yield this.service.user.getByEmail(email)
            if (!user) {
                this.error('此邮箱未注册')
            }
            const hasCode = this.service.cache.has(user._id.toString())
            if (hasCode) {
                this.error('请勿重复发送')
            }
            const code = this.service.cache.verifyCodeCache(user._id.toString(), 6)
            const rs = yield this.service.email.resetPassword(code, user)
            if (rs && rs.messageId) {
                this.success(true);
            } else {
                this.error('发送验证码失败，请重试')
            }
        }
        get() {
            const rs = this.service.cookie.getUser()
            if (rs && rs._id) {
                this.success(rs)
            } else {
                this.error({
                    code: 401,
                    msg: '未登录'
                })
            }
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
