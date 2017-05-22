const md5 = require('blueimp-md5')
module.exports = app => {
    class User extends app.Service {
        * create(user) {
            return (yield new app.model.user({
                email: user.email,
                password: md5(user.password, this.config.md5Key),
                name: user.name
            }).save()).toObject()
        }
        * get(user) {
            return yield app.model.user.findOne({
                email: user.email,
                password: md5(user.password, this.config.md5Key)
            }).lean()
        }
  }
  return User;
};