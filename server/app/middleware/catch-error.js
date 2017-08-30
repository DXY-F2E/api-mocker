module.exports = (options, app) => {
  return function * catchError (next) {
    try {
      yield next
    } catch (e) {
      this.ctx.status = e.status || 501
      this.ctx.responseText = e.message
    }
  }
}
