const Service = require('egg').Service
const md5 = require('blueimp-md5')

class UserService extends Service {
  async create (user) {
    return (await this.ctx.model.User({
      email: user.email,
      password: md5(user.password, this.config.md5Key),
      name: user.name
    }).save()).toObject()
  }
  getByEmail (email) {
    return this.ctx.model.User.findOne({
      email
    }).lean()
  }
  getById (id) {
    return this.ctx.model.User.findOne({
      _id: id
    })
  }
  getByIds (ids) {
    return this.ctx.model.User.find({
      _id: {
        $in: ids
      }
    })
  }
  find (q) {
    const reg = new RegExp(`.*${q}.*`, 'i')
    return this.ctx.model.User.find({
      isDeleted: false,
      $or: [
        { name: reg },
        { email: reg }
      ]
    })
  }
  updatePassword (email, password) {
    return this.ctx.model.User.findOneAndUpdate({
      email
    }, {
      password: md5(password, this.config.md5Key),
      modifiedTime: new Date()
    }, { new: true }).lean()
  }
  updatePasswordByOldPassword (oldPassword, newPassword) {
    return this.ctx.model.User.findOneAndUpdate({
      _id: this.ctx.authUser._id,
      password: md5(oldPassword, this.config.md5Key)
    }, {
      password: md5(newPassword, this.config.md5Key),
      modifiedTime: new Date()
    }, { new: true }).lean()
  }
  // 修改用户信息
  update (user) {
    const authId = this.ctx.authUser._id
    return this.ctx.model.User.findOneAndUpdate({
      _id: authId
    }, {
      name: user.name,
      email: user.email,
      modifiedTime: new Date()
    }, { new: true }).lean()
  }
}

module.exports = UserService
