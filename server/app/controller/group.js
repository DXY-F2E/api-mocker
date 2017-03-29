const assert = require('http-assert')
const R = require('ramda')

module.exports = app =>{
    class GroupController extends app.Controller {
        * getAll () {
            const { offset, limit } = this.ctx.query
            const resources = yield app.model.group
                                       .find({})
                                       .skip(offset)
                                       .limit(limit)
                                       .exec()
            
            this.ctx.body = { resources }
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
