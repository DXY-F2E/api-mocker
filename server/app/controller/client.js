const buildExampleFromSchema = require('mocker-dsl-core/lib/buildExampleFromSchema')
const AbstractController = require('./abstract')

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(true), ms))

const BASE_TYPES = [ 'string', 'number', 'boolean', 'object', 'array' ]

class ClientController extends AbstractController {
  async findApi () {
    const id = this.ctx.params[0]
    if (id.length < 5) {
      // hack方法，兼容老的存下url信息的api
      const url = `/client/${id}`
      return this.ctx.model.Api.findOne({ url }).exec()
    }
    return this.ctx.model.Api.findOne({ _id: id }).exec()
  }
  async real () {
    const { _apiRealUrl, _apiMethod } = this.ctx.request.body
    if (!_apiRealUrl || !_apiMethod) {
      this.ctx.body = {
        success: false,
        message: '真实地址为空'
      }
    }
    // 删除这两个参数，代理其他参数
    delete this.ctx.request.body._apiRealUrl
    delete this.ctx.request.body._apiMethod
    await this.proxy(_apiRealUrl, _apiMethod)
  }
  async proxy (url, method) {
    const query = this.ctx.request.url.split('?')[1]
    if (query) {
      url += `?${query}`
    }
    const headers = this.ctx.headers
    delete headers.host // 提交的header.host是mocker的host，需要删除
    if (headers['api-cookie']) { // 如果请求头带有此字段，则设置cookie
      headers.cookie = headers['api-cookie']
      delete headers['api-cookie']
    }
    const opts = {
      rejectUnauthorized: false, // 代理https请求时忽略证书校验
      headers,
      method,
      data: this.ctx.request.body
    }
    const result = await this.ctx.curl(url, opts)
    this.ctx.status = result.status
    delete result.headers['content-encoding'] // 设置了gzip encoding的话，转发请求将会出错，先取消此请求头的返回
    delete result.headers['access-control-allow-origin'] // 开发环境不一定在api服务端这个允许头内，故将其删除，防止代理失败
    this.ctx.set(result.headers)
    this.ctx.body = result.data
  }
  buildRestUrl (baseUrl, api) {
    const params = this.getPathParams(api)
    if (Object.keys(params).length <= 0) {
      return baseUrl
    }
    for (const key in params) {
      const placeholder = `:${key}`
      if (baseUrl.indexOf(placeholder) === -1) {
        baseUrl += `/${params[key]}`
      } else {
        baseUrl = baseUrl.replace(placeholder, params[key])
      }
    }
    return baseUrl
  }
  async handleProxy (api) { // 如果url中带有_mockProxyStatus此参数，也开启代理转发
    const { _mockProxyStatus } = this.ctx.request.query
    if (api.options.proxy.mode === 1 || _mockProxyStatus === '1') { // 代理转发线上
      await this.proxy(this.buildRestUrl(api.prodUrl, api), api.options.method)
      return true
    }
    if (api.options.proxy.mode === 2 || _mockProxyStatus === '2') { // 代理转发测试
      await this.proxy(this.buildRestUrl(api.devUrl, api), api.options.method)
      return true
    }
    return false
  }
  async handleRequest (method, api) {
    if (!api) {
      return
    }
    if (api.options.method !== method) {
      this.ctx.status = 405
      return
    }
    if (await this.handleProxy(api)) {
      return
    }
    const delay = api.options.delay || 0
    await sleep(delay)
    this.validateParams(api)
    this.ctx.body = this.getResponse(api) || {}
  }
  getResponse (api) {
    if (api.options.response && api.options.response.length > 0) {
      const index = api.options.responseIndex
      const idx = index === -1 ? parseInt(Math.random() * api.options.response.length) : index
      const schema = api.options.response[idx]
      return buildExampleFromSchema(schema)
    } else {
      return {}
    }
  }
  // get/:id
  async show () {
    const document = await this.findApi()
    await this.handleRequest('get', document)
  }
  // post /
  async create () {
    const document = await this.findApi()
    await this.handleRequest('post', document)
  }
  // put
  async put () {
    const document = await this.findApi()
    await this.handleRequest('put', document)
  }
  // patch
  async patch () {
    const document = await this.findApi()
    await this.handleRequest('patch', document)
  }
  // delete
  async delete () {
    const document = await this.findApi()
    await this.handleRequest('delete', document)
  }
  getPathParams (api) { // 获取RESTful风格Url参数
    const pathParams = {}
    const params = (this.ctx.params[1] || '').split('/')
    api.options.params.path.forEach((p, index) => {
      return p.key && params[index] && (pathParams[p.key] = params[index])
    })
    return pathParams
  }
  getValidatorType (method, paramType) {
    // 若参数是以query 或者 restful 或者 x-www-form-urlencoded 方式提交的，则允许字符串格式的数字与布尔值
    const isUnstrict = method === 'query' || method === 'path' || this.ctx.header['content-type'].indexOf('x-www-form-urlencoded')
    if (isUnstrict && ['number', 'boolean'].indexOf(paramType) > -1) {
      return `unstrict_${paramType}`
    }
    return paramType
  }
  validateParams (api) {
    const data = {
      query: this.ctx.request.query,
      body: this.ctx.request.body,
      path: this.getPathParams(api)
    }
    const { params, method } = api.options
    for (const name in params) {
      const rule = {}
      // get请求不校验body
      if (method === 'get' && name === 'body') continue
      params[name].forEach(param => {
        // 参数不存在或者参数类型不属于基本类型时，不校验
        if (!param.key || BASE_TYPES.indexOf(param.type) === -1) return
        rule[param.key] = {
          type: this.getValidatorType(name, param.type),
          required: param.required,
          allowEmpty: param.type === 'string'
        }
      })
      this.ctx.validate(rule, data[name])
    }
  }
}

module.exports = ClientController
