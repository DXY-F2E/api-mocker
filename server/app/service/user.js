const md5 = require('blueimp-md5')
module.exports = app => {
  class UserService extends app.Service {
    * create (user) {
      return (yield app.model.user({
        email: user.email,
        password: md5(user.password, this.config.md5Key),
        name: user.name
      }).save()).toObject()
    }
    getByEmail (email) {
      return app.model.user.findOne({
        email
      }).lean()
    }
    getById (id) {
      return app.model.user.findOne({
        _id: id
      })
    }
    getByIds (ids) {
      return app.model.user.find({
        _id: {
          $in: ids
        }
      })
    }
    find (q) {
      const reg = new RegExp(`.*${q}.*`, 'i')
      return app.model.user.find({
        isDeleted: false,
        $or: [
          { name: reg },
          { email: reg }
        ]
      })
    }
    updatePassword (email, password) {
      return app.model.user.findOneAndUpdate({
        email
      }, {
        password: md5(password, this.config.md5Key),
        modifiedTime: new Date()
      }, { new: true }).lean()
    }
    updatePasswordByOldPassword (oldPassword, newPassword) {
      return app.model.user.findOneAndUpdate({
        _id: this.ctx.authUser._id,
        password: md5(oldPassword, this.config.md5Key)
      }, {
        password: md5(newPassword, this.config.md5Key),
        modifiedTime: new Date()
      }, { new: true }).lean()
    }
    update (user) {
      const authId = this.ctx.authUser._id
      return app.model.user.findOneAndUpdate({
        _id: authId
      }, {
        name: user.name,
        email: user.email,
        modifiedTime: new Date()
      }, { new: true }).lean()
    }
  }
  return UserService
}
