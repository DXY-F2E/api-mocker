const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

module.exports = app => {
    class UserController extends app.Controller {
        * create() {
            const info = this.ctx.request.body
            const rs = (yield new app.model.user({
                            email: info.email,
                            password: md5(info.password, this.config.md5Key),
                            name: info.name
                        }).save()).toObject()
            delete rs.password
            this.setUserCookie()
            this.success(rs)
        }
        * login() {
            const info = this.ctx.request.body
            const rs = yield app.model.user.findOne({
                email: info.email,
                password: md5(info.password, this.config.md5Key)
            }).lean()
            if (rs && rs._id) {
                delete rs.password
                rs.cookie = this.ctx.cookies.get('mockerUser', {
                    signed: true,
                    encrypt: true
                })
                this.setUserCookie(rs)
                this.success(rs)
            } else {
                this.fail('账号或密码错误')
            }
        }
        setUserCookie(user) {
            this.ctx.cookies.set('mockerUser', user._id.toString(), {
                overwrite: true,
                encrypt: true // 加密传输
            })
        }
    }
    return UserController
}
