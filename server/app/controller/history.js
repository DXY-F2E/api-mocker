const AbstractController = require('./abstract')

class HistoryController extends AbstractController {
  * getApi () {
    const { apiId } = this.ctx.params
    const histories = yield this.service.apiHistory.get(apiId)
    this.ctx.body = { histories }
    this.ctx.status = 200
  }
}

module.exports = HistoryController
