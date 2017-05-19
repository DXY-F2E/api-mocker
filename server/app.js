module.exports = app => {
  class AbstractController extends app.Controller {
    success(data) {
      this.ctx.body = {
        success: true,
        data
      }
    }
    fail(msg) {
        success: false,
        msg
    }
    error(data) {
        this.ctx.throw(data.code, data.msg)
    }
    notFound(msg) {
      msg = msg || 'not found'
      this.ctx.throw(404, msg)
    }
  }

  app.Controller = AbstractController
}