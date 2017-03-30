const R = require('ramda')
const util = require('../util.js')
const assert = require('http-assert')

module.exports = app => {
    class ApiController extends app.Controller {
        * getAll () {
            let { limit = 30, offset = 0, order = false} = this.ctx.query
            const resources = yield app.model.api
                                       .find({})
                                       .sort({modifiedTime: -1, createTime: -1})
                                       .skip(offset)
                                       .limit(limit)
                                       .exec()
            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * getGroupAll () {
            const { groupId } = this.ctx.params
            const { limit = 30, offset = 0} = this.ctx.query
            
            assert(groupId, 403, 'invalid groupId')
            
            const resources = yield app.model.api
                                       .find({group: groupId})
                                       .sort({modifiedTime: -1, createTime: -1})
                                       .skip(offset)
                                       .limit(limit)
                                       .exec()

            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * modifyApi () {
            const { groupId, apiId } = this.ctx.params
            const { body } = this.ctx.request
            assert(groupId, 403, 'invalid groupId')
            assert(apiId, 403, 'invalid apiId')

            const resources = yield app.model.api.findOneAndUpdate({
                group: groupId,
                _id: apiId
            }, R.merge(body, {modifiedTime: Date.now()} )).exec()
            
            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()

            this.ctx.body = { resources }
        }
        * getApi () {
            const { groupId, apiId } = this.ctx.params
            assert(groupId, 403, 'invalid groupId')
            assert(apiId, 403, 'invalid apiId')
            
            const resources = yield app.model.api
                                       .findOne({group: groupId, _id:apiId})
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

            const nextUrl = yield util.generateApiURL(app)

            const resources = yield new app.model.api(R.merge(body, {
                createTime: Date.now(),
                group: groupId,
                url: nextUrl
            })).save()

            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * delete () {
            yield app.model.remove({
                _id: this.ctx.params.apiId
            })
            this.ctx.status = 204
        }
    }
    return ApiController
}
