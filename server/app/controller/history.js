module.exports = app => {
  class HistoryController extends app.Controller {
    * getApi () {
      const { apiId } = this.ctx.params
      const histories = yield this.service.apiHistory.get(apiId)
      this.ctx.body = { histories }
      this.ctx.status = 200
    }
  }
  return HistoryController
}
