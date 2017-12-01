const AbstractController = require('./abstract')

class StatController extends AbstractController {
  * mock () {
    const { start, end } = this.ctx.query
    this.ctx.body = yield this.service.stat.getMockStat(start, end)
  }
}

module.exports = StatController
