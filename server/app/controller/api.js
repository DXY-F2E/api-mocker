const R = require('ramda')
const util = require('../util.js')
const assert = require('http-assert')
const mongoose = require('mongoose')

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
                    {prodUrl: reg},
                    {'options.method': reg},
                ]
            }
            if (groupId)
                condition.group = groupId
            const resources = yield app.model.api
                                       .find(condition)
                                       .sort({modifiedTime: -1, createTime: -1})
                                       .skip((page-1)* limit )
                                       .limit(limit)
                                       .exec()
            const count = yield app.model.api.find(condition).count().exec()
            this.ctx.logger.info('getALl', this.ctx.query)
            this.ctx.body = { resources, pages: { limit, page, count}}
            this.ctx.status = 200
        }
        * modifyApi () {
            const { groupId, apiId } = this.ctx.params
            const { body } = this.ctx.request

            assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
            assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

            delete body._id

            const resources = yield app.model.api.findOneAndUpdate({
                group: groupId,
                _id: apiId
            }, R.merge(body, {modifiedTime: Date.now()}), {new: true}).exec()
            //{new: true} 使结果能返回更新后的数据
            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()

            this.ctx.logger.info('modifyApi', body)
            this.ctx.body = { resources }
        }
        * getApi () {
            const { groupId, apiId } = this.ctx.params

            assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
            assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

            const resources = yield app.model.api
                                       .findOne({_id: apiId, isDeleted: false})
                                       .exec()

            this.ctx.logger.info('getApi')
            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * createApi () {
            const { groupId } = this.ctx.params
            const { body } = this.ctx.request

            assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
            assert(body.name, 403, 'required name')
            // assert(body.dsl, 403, 'required dsl')

            const nextUrl = yield util.generateApiURL(app)

            const resources = yield new app.model.api(R.merge(body, {
                createTime: Date.now(),
                group: groupId,
                url: nextUrl
            })).save()

            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()

            this.ctx.logger.info('createApi', body)
            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * delete () {
            const { groupId, apiId } = this.ctx.params

            assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
            assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

            yield app.model.api.update({
                _id: this.ctx.params.apiId
            }, {
                isDeleted: true
            })
            yield app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()
            this.ctx.logger.info('deleteApi')
            this.ctx.status = 204
        }
    }
    return ApiController
}
