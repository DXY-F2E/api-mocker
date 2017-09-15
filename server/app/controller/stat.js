module.exports = app => {
  class StatController extends app.Controller {
    * mock () {
      const { start, end } = this.ctx.query
      this.ctx.body = yield this.service.stat.getMockStat(start, end)
    }
  }
  return StatController
}
