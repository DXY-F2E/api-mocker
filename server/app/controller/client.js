const dslCore = require('../../../dsl-core/index.js')
const R = require('ramda')
const Mock = require('mockjs')
const sleep = (ms) => {
  return cb => setTimeout(cb, ms)
}
module.exports = app => {

    class ClientController extends app.Controller {
        * findApi(method) {
            const { id } = this.ctx.params;
            if (id.length < 5) {
                // hack方法，兼容老的存下url信息的api
                const url = `/client/${id}`
                return yield app.model.api.findOne({url: url, "options.method": method}).exec()
            } else {
                return yield app.model.api.findOne({_id: id, "options.method": method}).exec()
            }
        }
        * real() {
            let {_apiRealUrl, _apiMethod} = this.ctx.request.body
            if (!_apiRealUrl || !_apiMethod) {
                this.ctx.body = {
                    success: false,
                    message: '真实地址为空'
                }
            }
            delete this.ctx.request.body._apiRealUrl
            delete this.ctx.request.body._apiMethod
            yield this.proxy(_apiRealUrl, _apiMethod)
        }
        * proxy(url, method) {
            url += `?${this.ctx.request.url.split('?')[1]}`
            const opts = method === 'get' ? {} : {
                contentType: 'json',
                // body数据，暂时只支持json格式，未来可以从header中判断
                data: this.ctx.request.body,
                headers: this.ctx.headers,
                dataType: 'json'
            }
            opts.method = method
            const result = yield this.ctx.curl(url, opts);
            this.ctx.status = result.status;
            this.ctx.set(result.headers);
            this.ctx.body = result.data
        }
        * handleProxy(api) {
            const { _mockProxyStatus } = this.ctx.request.query
            if (api.options.proxy.mode === 1 || _mockProxyStatus === '1') {
                yield this.proxy(api.prodUrl, api.options.method)
                return true
            }
            return false
        }
        * handleRequest(api) {
            if (!api) {
                return
            }
            if (yield this.handleProxy(api)) {
                return
            }
            const delay = api.options.delay || 0
            yield sleep(delay)
            const params = R.merge(this.ctx.request.body, this.ctx.request.query)
            this.validateParams(api, params)
            this.ctx.body = dslCore.renderer(params)(this.getResponse(api) || {})
        }
        getResponse(api) {
            if (api.options.response && api.options.response.length > 0) {
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
                    if (!param.key) return
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
