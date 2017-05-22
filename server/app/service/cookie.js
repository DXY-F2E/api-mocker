const md5 = require('blueimp-md5')
module.exports = app => {
  class Cookie extends app.Service {
    set (key, value, config = {}) {
      this.ctx.cookies.set(key, value, Object.assign({
          overwrite: true,
          encrypt: true // 加密传输
      }, config))
    }
    get (key) {
      return this.ctx.cookies.get(key, {
          overwrite: true,
          encrypt: true
      })
    }
    setUser(user) {
      this.set('mockerUser', JSON.stringify(user))
    }
    getUser(user) {
      try {
        return JSON.parse(this.get('mockerUser'))
      } catch (e) {
        return null
      }
    }
    clearUser(user) {
      this.set('mockerUser', '', {
        expires: Date.now()
      })
    }
  }
  return Cookie;
};