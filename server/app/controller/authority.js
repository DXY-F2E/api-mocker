module.exports = app => {
    class AuthorityController extends app.Controller {
        * modifyApi () {
            const { apiId } = this.ctx.params
            const authority = this.ctx.request.body

            const isManager = yield this.service.api.isManager(apiId)
            if (!isManager) {
              this.error('无权操作');
            }

            const rs = yield this.service.apiAuthority.update(apiId, authority)
            if (!rs) {
                this.error('更新失败');
            } else {
                this.success('更新成功');
            }
        }
        * getApi () {
            const { apiId } = this.ctx.params
            const authority = (yield this.service.apiAuthority.get(apiId)) || new app.model.apiAuthority()
            authority.apiId = apiId;
            this.success(authority)
        }
    }
    return AuthorityController
}
