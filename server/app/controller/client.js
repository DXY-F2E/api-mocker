const renderer = require('../../../dsl-core/index.js').renderer
const R = require('ramda')
const sleep = (ms) => {
  return cb => setTimeout(cb, ms)
}
module.exports = app => {

    class ClientController extends app.Controller {
        * findApi(method) {
            const url = this.ctx.request.url.split('?')[0]
            return yield app.model.api.findOne({url: url, "options.method": method}).exec()
        }
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
        // get/:id
        * show () {
            const document = yield this.findApi('get')
            yield this.handleRequest(document)
        }
        // post /
        * create () {
            const document = yield this.findApi('post')
            yield this.handleRequest(document)
        }
        //put
        * put () {
            const document = yield this.findApi('put')
            yield this.handleRequest(document)
        }
        // delete
        * delete () {
            const document = yield this.findApi('delete')
            yield this.handleRequest(document)
        }
        validateParams(document, data) {
            const rule = {};
            const { params, method } = document.options
            for (var name in params) {
                if (method === 'get' && name !== 'query') continue
                params[name].forEach(param => {
                    rule[param.key] = {
                        type: param.type === 'number' ? 'checkNumber': param.type,
                        required: param.required
                    }
                })
            }
            this.ctx.validate(rule, data)
        }
    }

    // 数字校验-允许提交字符串格式的数字
    app.validator.addRule('checkNumber', (rule, value) => {
        if (value && Number(value) == value) {
            value = Number(value)
        }
        if (typeof value !== 'number') {
          return 'should be a number';
        }
    });

    return ClientController
}
