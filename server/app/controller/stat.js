const AbstractController = require('./abstract')

class StatController extends AbstractController {
  async mock () {
    const { start, end } = this.ctx.query
    this.ctx.body = await this.service.stat.getMockStat(start, end)
  }
}

module.exports = StatController
