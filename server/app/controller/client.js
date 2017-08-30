const dslCore = require('../../../dsl-core/index.js')

const sleep = ms => cb => setTimeout(cb, ms)

const BASE_TYPES = [ 'string', 'number', 'boolean', 'object', 'array' ]
module.exports = app => {
  class ClientController extends app.Controller {
    * findApi (method) {
      const id = this.ctx.params[0]
      if (id.length < 5) {
                // hack方法，兼容老的存下url信息的api
        const url = `/client/${id}`
        return yield app.model.api.findOne({ url, 'options.method': method }).exec()
      }
      return yield app.model.api.findOne({ _id: id, 'options.method': method }).exec()
    }
    * real () {
      const { _apiRealUrl, _apiMethod } = this.ctx.request.body
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
    * proxy (url, method) {
      const query = this.ctx.request.url.split('?')[1]
      if (query) {
        url += `?${query}`
      }
      const headers = this.ctx.headers
            // 提交的header.host是mocker的host，需要删除
      delete headers.host
      if (headers['api-cookie']) {
        headers.cookie = headers['api-cookie']
        delete headers['api-cookie']
      }
      const opts = method === 'get' ? {} : {
                // body数据，暂时只支持json格式，未来可以从header中判断
        data: this.ctx.request.body,
        headers,
        dataType: 'json'
      }
      opts.method = method
      const result = yield this.ctx.curl(url, opts)
      this.ctx.status = result.status
            // 设置了gzip encoding的话，转发请求将会出错，先取消此请求头的返回
      delete result.headers['content-encoding']
      this.ctx.set(result.headers)
      this.ctx.body = result.data
    }
    * handleProxy (api) {
      const { _mockProxyStatus } = this.ctx.request.query
      if (api.options.proxy.mode === 1 || _mockProxyStatus === '1') {
        yield this.proxy(api.prodUrl, api.options.method)
        return true
      }
      if (api.options.proxy.mode === 2 || _mockProxyStatus === '2') {
        yield this.proxy(api.devUrl, api.options.method)
        return true
      }
      return false
    }
    * handleRequest (api) {
      if (!api) {
        return
      }
      if (yield this.handleProxy(api)) {
        return
      }
      const delay = api.options.delay || 0
      yield sleep(delay)
      this.validateParams(api)
      this.ctx.body = this.getResponse(api) || {}
    }
    getResponse (api) {
      if (api.options.response && api.options.response.length > 0) {
        const index = api.options.responseIndex
        const idx = index === -1 ? parseInt(Math.random() * api.options.response.length) : index
        const schema = api.options.response[idx]
        return schema.example || dslCore.buildExampleFromSchema(schema)
      }
      return api.dsl
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
        // put
    * put () {
      const document = yield this.findApi('put')
      yield this.handleRequest(document)
    }
        // delete
    * delete () {
      const document = yield this.findApi('delete')
      yield this.handleRequest(document)
    }
    getPathParams (api) {
      const pathParams = {}
      const params = (this.ctx.params[1] || '').split('/')
      api.options.params.path.forEach((p, index) => {
        pathParams[p.key] = params[index]
      })
      return pathParams
    }
    validateParams (api) {
      const data = {
        query: this.ctx.request.query,
        body: this.ctx.body,
        path: this.getPathParams(api)
      }
      const { params, method } = api.options
      for (const name in params) {
        const rule = {}
        if (method === 'get' && name === 'body') continue
        params[name].forEach(param => {
                    // 参数不存在或者参数类型不属于基本类型时，不校验
          if (!param.key || BASE_TYPES.indexOf(param.type) === -1) return
          rule[param.key] = {
            type: param.type === 'number' ? 'checkNumber' : param.type,
            required: param.required,
            allowEmpty: param.type === 'string'
          }
        })
        this.ctx.validate(rule, data[name])
      }
    }
  }

    // 数字校验-允许提交字符串格式的数字
  app.validator.addRule('checkNumber', (rule, value) => {
    if (value && !isNaN(value)) {
      value = Number(value)
    }
    if (typeof value !== 'number') {
      return 'should be a number'
    }
  })

  return ClientController
}
