const AbstractController = require('./abstract')

class AuthorityController extends AbstractController {
  async modifyApi () {
    const { apiId } = this.ctx.params
    const { operation } = this.ctx.request.body
    const authority = { operation }

    const isManager = await this.service.api.isManager(apiId)
    if (!isManager) {
      this.error('无权操作')
    }

    const rs = await this.service.apiAuthority.update(apiId, authority)
    if (!rs) {
      this.error('更新失败')
    } else {
      this.success('更新成功')
    }
  }
  async getApi () {
    const { apiId } = this.ctx.params
    const authority = (await this.service.apiAuthority.get(apiId)) || this.ctx.model.ApiAuthority()
    authority.apiId = apiId
    this.success(authority)
  }
}
module.exports = AuthorityController
