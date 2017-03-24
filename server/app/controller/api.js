const R = require('ramda')

module.exports = app => {
    class ApiController extends app.Controller {
        * getAll () {
            let { limit = 30, offset = 0, order = false} = this.ctx.query
            const resources = yield app.model.api
                                       .find({})
                                       .skip(offset)
                                       .limit(limit)
                                       .exec()
            this.body = { resources }
            this.ctx.status = 200
        }
        * getGroupAll () {
            const { groupId } = this.ctx.params
            const { limit = 30, offset = 0} = this.ctx.query
            
            assert(groupId, 403, 'invalid groupId')
            
            const resources = yield app.model.api
                                       .find({group: groupId})
                                       .skip(offset)
                                       .limit(limit)
                                       .exec()
            
            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * getApi () {
            const { groupId, apiId } = this.ctx.params
            assert(groupId, 403, 'invalid groupId')
            assert(apiId, 403, 'invalid apiId')
            
            const resources = yield app.model.api
                                       .find({group: groupId, _id:apiId})
                                       .exec()
            
            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * createApi () {
            const { groupId } = this.ctx.params
            const { body } = this.ctx.request
            
            assert(groupId, 403, 'invalie groupId')
            assert(body.name, 403, 'required name')
            assert(body.dsl, 403, 'required dsl')
            
            yield new app.model.api(R.merge(body, {
                createTime: Date.now(),
                group: groupId
            })).save()

            this.ctx.body = 204
        }
    }
    return ApiController
}
