module.exports = app => {
    class UserController extends app.Controller {
        * create() {
            const info = this.ctx.request.body
            const rs = yield this.service.user.create(info)
            delete rs.password
            this.service.cookie.setUser(rs)
            this.success(rs)
        }
        * login() {
            const info = this.ctx.request.body
            const rs = yield this.service.user.get(info)
            if (rs && rs._id) {
                delete rs.password
                this.service.cookie.setUser(rs)
                this.success(rs)
            } else {
                this.fail('账号或密码错误')
            }
        }
        logout() {
            this.service.cookie.clearUser()
            this.success()
        }
    }
    return UserController
}
