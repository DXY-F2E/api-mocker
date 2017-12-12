const AbstractController = require('./abstract')

class HistoryController extends AbstractController {
  async getApi () {
    const { apiId } = this.ctx.params
    const histories = await this.service.apiHistory.get(apiId)
    this.ctx.body = { histories }
    this.ctx.status = 200
  }
}

module.exports = HistoryController
