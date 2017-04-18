const assert = require('http-assert')
const R = require('ramda')

module.exports = app =>{
    class GroupController extends app.Controller {
        * getAll () {
            const resources = yield app.model.group
                                       .find({})
                                       .sort({modifiedTime: -1, createTime: -1})
                                       .exec()

            this.ctx.body = { resources }
            this.ctx.status = 200
        }
        * get () {
            let { limit = 20, page = 1, q = '.*'} = this.ctx.query
            page = Number(page)
            limit = Number(limit)
            const reg = new RegExp(`.*${q}.*`, 'i')
            const cond = {
                isDeleted: false,
                name: reg
            }
            const resources = yield app.model.group
                                       .find(cond)
                                       .sort({modifiedTime: -1, createTime: -1})
                                       .skip((page-1) * limit)
                                       .limit(limit)
                                       .exec()
            const count = yield app.model.group.find(cond).count().exec()
            this.ctx.body = { resources , pages: { limit, page, count}}
            this.ctx.status = 200
        }
        * create () {
            const { body } = this.ctx.request

            assert(body.name, 403 , 'required group name')

            const resources = yield new app.model.group(R.merge(body, {
                createTime: Date.now()
            }) ).save()

            this.ctx.body = { resources }
        }
        * delete () {
            const { id } = this.ctx.params

            yield app.model.group.remove({_id: id}).exec()
            this.ctx.status = 204
        }
    }
    return GroupController;
}
