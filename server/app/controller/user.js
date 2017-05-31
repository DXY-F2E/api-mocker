const md5 = require('blueimp-md5')
module.exports = app => {
    class UserController extends app.Controller {
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
            const rs = yield this.service.user.create(info)
            delete rs.password
            this.service.cookie.setUser(rs)
            this.success(rs)
        }
        * login() {
            const info = this.ctx.request.body
            const user = yield this.service.user.getByEmail(info.email)
            console.log(user)
            if (!user) {
                this.fail('账号不存在')
                return
            }
            if (user.password !== md5(info.password, this.config.md5Key)) {
                this.fail('密码错误')
                return
            }
            delete user.password
            this.service.cookie.setUser(user)
            this.success(user)
        }
        logout() {
            this.service.cookie.clearUser()
            this.success()
        }
    }
    return UserController
}
