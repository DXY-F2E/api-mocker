const AbstractController = require('./abstract')

class HistoryController extends AbstractController {
  async getApi () {
    const { apiId } = this.ctx.params
    this.ctx.body = await this.service.apiHistory.get(apiId)
    this.ctx.status = 200
  }
}

module.exports = HistoryController
