const AbstractController = require('./abstract')

class HomeController extends AbstractController {
  async index () {
    const { NODE_ENV } = this.app.config.env
    const { timeStamp } = this.app
    const assetUrl = NODE_ENV === 'development' ? '_develop' : ''
    await this.ctx.render('index.tpl', {
      assetUrl,
      timeStamp
    })
  }
}

module.exports = HomeController
