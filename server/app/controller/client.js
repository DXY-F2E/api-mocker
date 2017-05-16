const dslCore = require('../../../dsl-core/index.js')
const R = require('ramda')
const Mock = require('mockjs')
const sleep = (ms) => {
  return cb => setTimeout(cb, ms)
}
module.exports = app => {

    class ClientController extends app.Controller {
        * findApi(method) {
            const url = this.ctx.request.url.split('?')[0]
            return yield app.model.api.findOne({url: url, "options.method": method}).exec()
        }
        * real() {
            let {realUrl, method} = this.ctx.request.body
            if (!realUrl || !method) {
                this.ctx.body = {
                    success: false,
                    message: '真实地址为空'
                }
            }
            realUrl = this.ctx.request.url.replace('/client/real', realUrl)
            delete this.ctx.request.body.realUrl
            delete this.ctx.request.body.method
            const result = yield this.ctx.curl(realUrl, {
                method: method,
                // body数据，暂时只支持json格式，未来可以从header中判断
                contentType: 'json',
                data: this.ctx.request.body,
                dataType: 'json'
            });
            this.ctx.status = result.status;
            this.ctx.set(result.headers);
            this.ctx.body = result.data
        }
        * handleRequest(document) {
            if (!document) {
                return
            }
            const delay = document.options.delay || 0
            yield sleep(delay)
            const params = R.merge(this.ctx.request.body, this.ctx.request.query)

            this.validateParams(document, params)
            this.ctx.body = dslCore.renderer(params)(this.getResponse(document) || {})
        }
        getResponse(api) {
            if (api.options.response && api.options.response.length > 1) {
                const index = api.options.responseIndex
                const idx = index === -1 ? parseInt(Math.random() * api.options.response.length) : index
                const schema = api.options.response[idx]
                return schema.example || dslCore.buildExampleFormSchema(schema)
            } else {
                return api.dsl
            }
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
