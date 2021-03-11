const md5 = require('blueimp-md5')
const AbstractController = require('./abstract')

class UserController extends AbstractController {
  async search () {
    const { query = '' } = this.ctx.query
    const users = await this.service.user.find(query).lean()
    this.success(users.map(u => {
      delete u.password
      return u
    }))
  }
  async sentResetPassCode () {
    const { email } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const key = 'password_' + user._id
    const hasCode = this.service.cache.has(key)
    if (hasCode) {
      this.error('请勿重复发送')
    }
    const code = this.service.cache.verifyCodeCache(key, 6)
    const rs = await this.service.email.resetPassword(code, user)
    if (rs && rs.messageId) {
      this.success(true)
    } else {
      this.error('发送验证码失败，请重试')
    }
  }
  async sentResetPassTicket () {
    const { email } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const ticket = this.service.ticket.create(user._id, 'password')
    const rs = await this.service.email.passwordTicket(ticket, user)
    if (rs && rs.messageId) {
      this.success(true)
    } else {
      this.error('发送邮件失败，请重试')
    }
  }
  async resetPasswordByTicket () {
    const { email, password, ticket } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const encode = this.service.ticket.check(ticket, 'password', user._id.toString(), user.modifiedTime)
    if (!encode.success) {
      this.error(encode.msg)
    }
    const rs = await this.service.user.updatePassword(email, password)
    if (!rs) {
      this.error('修改失败', 500)
    }
    this.success(true)
  }
  async resetPassword () {
    const { email, password, verifyCode } = this.ctx.request.body
    const user = await this.service.user.getByEmail(email)
    if (!user) {
      this.error('此邮箱未注册')
    }
    const key = 'password_' + user._id
    const correctCode = this.service.cache.get(key)
    if (correctCode !== verifyCode) {
      this.ctx.logger.info('verifyCode error', `correctCode: ${correctCode}，verifyCode: ${verifyCode}`)
      this.error('验证码错误')
    }
    const rs = await this.service.user.updatePassword(email, password)
    if (!rs) {
      this.error('修改失败', 500)
    }
    this.service.cache.del(key)
    this.success(true)
  }
  /* 获取用户信息 */
  async get () {
    const rs = this.service.cookie.getUser()
    if (!rs || !rs._id) {
      this.error({
        code: 401,
        msg: '未登录'
      })
    }
    const user = await this.service.user.getById(rs._id)
    if (!user || user.modifiedTime > new Date(rs.modifiedTime)) {
      this.error({
        code: 401,
        msg: '信息已发生变更，请重新登录'
      })
    }
    this.success(user)
  }
  async create () {
    const info = this.ctx.request.body
    const user = await this.service.user.getByEmail(info.email)
    if (user) {
      this.error('此邮箱已被注册')
    }
    const rs = await this.service.user.create(info)
    delete rs.password
    this.service.cookie.setUser(rs)
    this.success(rs)
  }
  async login () {
    const info = this.ctx.request.body
    const user = await this.service.user.getByEmail(info.email)
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
  async update () {
    const user = this.ctx.request.body
    const rs = await this.service.user.update(user)
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
  async updatePassword () {
    const { originPassword, password, verifyPassword } = this.ctx.request.body
    if (originPassword.trim() === '' || password.trim() === '' || verifyPassword.trim() === '') {
      this.error('信息不能为空')
    }
    if (password !== verifyPassword) {
      this.error('确认密码不一致')
    }
    const rs = await this.service.user.updatePasswordByOldPassword(originPassword, password)
    if (!rs) {
      this.error('密码错误')
    }
    delete rs.password
    this.service.cookie.setUser(rs)
    this.success(rs)
  }
  logout () {
    this.service.cookie.clearUser()
    this.success('注销成功')
  }
  /**
   * 用户添加收藏
   * 找到当前用户
   * 将收藏信息存于用户模型中
  */
  async addFavorite () {
    const user = this.ctx.authUser
    const { groupId } = this.ctx.params

    try {
      if (user.favorites.some((f) => f && f.toString() === groupId)) {
        this.success(user)
      } else {
        const newUser = await this.ctx.model.User.findByIdAndUpdate(
          user._id,
          { favorites: [...user.favorites, groupId] },
          { new: true }
        )
        this.success(newUser)
      }
    } catch (err) {
      this.error('添加收藏失败')
    }
  }
  // 从用户收藏夹中剔除
  async removeFavorite () {
    const user = this.ctx.authUser
    const { groupId } = this.ctx.params
    try {
      const newUser = await this.ctx.model.User.findByIdAndUpdate(
        user._id,
        { favorites: user.favorites.filter(f => f.toString() !== groupId) },
        { new: true }
      )
      this.success(newUser)
    } catch (err) {
      this.error('取消收藏失败')
    }
  }
}

module.exports = UserController
