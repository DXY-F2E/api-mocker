const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
const appKeys = require('../../config/appKeys')

module.exports = app => {
    class UserController extends app.Controller {
        * create() {
            const info = this.ctx.request.body
            console.log('==========================')
            console.log(info)
            const rs = yield new app.model.user({
                email: info.email,
                password: md5(info.password, appKeys.md5Key),
                name: info.name,
                createTime: Date.now(),
                modifiedTime: Date.now()
            }).save()
            this.ctx.body = rs
        }
    }
    return UserController
}
