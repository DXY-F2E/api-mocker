const renderer = require('../../../dsl-core/index.js').renderer
const R = require('ramda')
const sleep = (ms) => {
  return cb => setTimeout(cb, ms)
}
module.exports = app => {
    class ClientController extends app.Controller {
        // get/:id
        * handleRequest(document) {
            if (!document) {
                return
            }
            const delay = document.options.delay || 0
            yield sleep(delay)
            const params = R.merge(this.ctx.request.body, this.ctx.request.query)
            this.validateParams(document, params)
            this.ctx.body = renderer(params)(document.dsl || {})
        }
        * show () {
            const { id }= this.ctx.params
            const document = yield app.model.api.findOne({url: `/client/${id}`, "options.method": /get/i}).exec()
            yield this.handleRequest(document)
        }
        // post /
        * create () {
            const document = yield app.model.api.findOne({url: this.ctx.request.url, "options.method": /post/i}).exec()
            yield this.handleRequest(document)
        }
        //put
        * put () {
            const document = yield app.model.api.findOne({url: this.ctx.request.url, "options.method": /put/i}).exec()
            yield this.handleRequest(document)
        }
        // delete
        * delete () {
            const document = yield app.model.api.findOne({url: this.ctx.request.url, "options.method": /delete/i}).exec()
            yield this.handleRequest(document)
        }
        validateParams(document, data) {
            const rule = {};
            const { params, method } = document.options
            for (var param of params) {
                rule[param.key] = {
                    type: (method === 'get') ? 'string' : param.type.toLowerCase(),
                    required: param.required
                }
            }
            this.ctx.validate(rule, data)
        }
    }

    return ClientController
}
