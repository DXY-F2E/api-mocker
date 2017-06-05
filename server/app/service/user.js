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
        getByEmail(email) {
            return app.model.user.findOne({
                email: email
                // password: md5(user.password, this.config.md5Key)
            }).lean()
        }
        getByIds(ids) {
            return app.model.user.find({
                _id: {
                    $in: ids
                }
            })
        }
        find(q) {
            const reg = new RegExp(`.*${q}.*`, 'i')
            return app.model.user.find({
                "$or": [
                    {name: reg},
                    {email: reg}
                ]
            })
        }
  }
  return User;
};