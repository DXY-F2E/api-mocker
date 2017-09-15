module.exports = (options, app) => {
  return function * auth (next) {
    if (this.request.url.indexOf('server') >= 0) {
      const user = this.service.cookie.getUser()
      if (user) {
        this.authUser = user
        yield next
      } else {
        this.status = 401
      }
    } else {
      yield next
    }
  }
}
