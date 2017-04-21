const R = require('ramda')
const util = require('../util.js')
const assert = require('http-assert')
const sleep = (ms) => {
  return cb => setTimeout(cb, ms)
}
module.exports = app => {
    class ApiController extends app.Controller {
        * getAll () {
            const { groupId } = this.ctx.params
            let { limit = 30, page = 1, order = false, q = '.*'} = this.ctx.query
            page = Number(page)
            limit = Number(limit)
            const reg = new RegExp(`.*${q}.*`, 'i')
            const condition = {
                isDeleted: false,
                "$or": [
                    {name: reg},
                    {url: reg},
                    {desc: reg},
                    {'options.method': reg},
                ]
            }
            if (groupId)
                condition.group = groupId
            // yield sleep(3000)
            const resources = yield app.model.api
                                       .find(condition)
                                       .sort({modifiedTime: -1, createTime: -1})
                                       .skip((page-1)* limit )
                                       .limit(limit)
                                       .exec()
            const count = yield app.model.api.find(condition).count().exec()
            this.ctx.body = { resources , pages: { limit, page, count}}
            this.ctx.status = 200
            this.ctx.logger.info('getALl', this.ctx.query);
        }
        * modifyApi () {
            const { groupId, apiId } = this.ctx.params
            const { body } = this.ctx.request
            assert(groupId, 403, 'invalid groupId')
            assert(apiId, 403, 'invalid apiId')

            delete body._id;

            const resources = yield app.model.api.findOneAndUpdate({
                group: groupId,
                _id: apiId
            }, R.merge(body, {modifiedTime: Date.now()}), {new: true}).exec()
            //{new: true} 使结果能返回更新后的数据
            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()

            this.ctx.body = { resources }
            this.ctx.logger.info('modifyApi', body);
        }
        * getApi () {
            const { groupId, apiId } = this.ctx.params
            assert(groupId, 403, 'invalid groupId')
            assert(apiId, 403, 'invalid apiId')

            const resources = yield app.model.api
                                       .findOne({group: groupId, _id:apiId, isDeleted: false})
                                       .exec()

            this.ctx.body = { resources }
            this.ctx.status = 200
            this.ctx.logger.info('getApi');
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
            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()

            this.ctx.body = { resources }
            this.ctx.status = 200
            this.ctx.logger.info('createApi', body);
        }
        * delete () {
            const { groupId } = this.ctx.params

            assert(groupId, 403, 'invalie groupId')
            assert(groupId !== 'undefined', 403, 'groupId is undefined')

            yield app.model.api.update({
                _id: this.ctx.params.apiId
            }, {
                isDeleted: true
            })
            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()
            this.ctx.status = 204
            this.logger.info('deleteApi');
        }
    }
    return ApiController
}
