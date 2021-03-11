const buildExampleFromSchema = require('mocker-dsl-core/lib/buildExampleFromSchema')
const AbstractController = require('./abstract')

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(true), ms))

const BASE_TYPES = ['string', 'number', 'boolean', 'object', 'array']

class ClientController extends AbstractController {
  async findApi () {
    const method = this.ctx.method.toLowerCase()
    // 组id或组prefix
    const id = this.ctx.params[0]
    let url = this.ctx.params[1]
    if (await this.ctx.model.Group.findOne({ _id: id }).exec()) {
      // 接口路径模式
      // 首先进行全匹配，只允许前面多个/
      const fullReg = new RegExp(`^/?${url}$`)
      let res = await this.ctx.model.Api.findOne({ url: fullReg, group: id, 'options.method': method, isDeleted: false }).exec()
      if (!res) {
        // 全匹配未找到，则进行restful路径参数匹配，如/api/:id
        // url中每个位置都全匹配或匹配路径参数，((api)|(:.*))
        let regex = `/${url}`.replace(/(?<=\/).*?((?=(\/))|$)/g, (...args) => `((${args[0]})|(:[^\/]*))`)
        regex = `^${regex}$`
        res = await this.ctx.model.Api.findOne({ url: { $regex: regex }, group: id, 'options.method': method, isDeleted: false }).exec()
      }
      return res
    } else {
      // 纯hash模式api，全匹配
      const res = this.ctx.model.Api.findOne({ _id: id, isDeleted: false }).exec()
      return res
    }
  }
  async real () {
    const { _apiRealUrl, _apiMethod } = this.ctx.request.body
    if (!_apiRealUrl || !_apiMethod) {
      this.ctx.status = 500
      this.ctx.body = { success: false, message: '真实地址或者请求方法为空' }
      return
    } else if (_apiRealUrl.indexOf('127.0.0.1') > -1 || _apiRealUrl.indexOf('localhost') > -1) {
      this.ctx.status = 500
      this.ctx.body = { success: false, message: '不支持回环地址' }
      return
    }
    await this.proxy(_apiRealUrl, _apiMethod)
  }
  async proxy (url, method) {
    const query = this.ctx.request.url.split('?')[1]
    if (query) {
      url += `?${query}`
    }
    const headers = this.ctx.headers
    delete headers.host // 提交的header.host是mocker的host，需要删除
    delete headers['content-length'] // mocker在线测试代理时，'content-length'客户端与代理端会不一致，故删除它
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
    await this.validateParams(api)
    this.ctx.body = this.getResponse(api) || {}
  }
  getResponse (api) {
    const queryStatus = parseInt(this.ctx.query.__api_mock_status__)
    if (api.options.response && api.options.response.length > 0) {
      const index = queryStatus >= 0 ? queryStatus : api.options.responseIndex
      const idx = index === -1 ? parseInt(Math.random() * api.options.response.length) : index
      const schema = api.options.response[idx]
      // 模拟异常请求
      let {status, statusText} = schema
      status = parseInt(status || 200)
      if (isNaN(status) || status < 100) {
        this.ctx.status = 500
        return {message: 'Status Code不正确'}
      } else if (status !== 200) {
        this.ctx.status = status
        return {message: statusText || '请求异常'}
      }
      return buildExampleFromSchema(schema)
    } else {
      return {}
    }
  }
  // get/:id
  async mock () {
    const document = await this.findApi()
    await this.handleRequest(this.ctx.method.toLowerCase(), document)
  }
  // 使用prodUrl或devUrl请求假数据
  async mockByUrl () {
    const document = await this.service.api.getByUrl(this.ctx.params[0], this.ctx.query._mockGroupId)
    await this.handleRequest(this.ctx.method.toLowerCase(), document)
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
    const isUnstrict =
      method === 'query' ||
      method === 'path' ||
      (
        this.ctx.header['content-type'] &&
        this.ctx.header['content-type'].indexOf('x-www-form-urlencoded')
      )
    if (isUnstrict && ['number', 'boolean'].indexOf(paramType) > -1) {
      return `unstrict_${paramType}`
    }
    return paramType
  }
  async validateParams (api) {
    const data = {
      query: this.ctx.request.query,
      body: this.ctx.request.body,
      // path: this.getPathParams(api),
      headers: this.ctx.request.headers
    }

    const contentType = this.ctx.header['content-type'] || ''
    if (contentType.indexOf('multipart') > -1) {
      const sendToWormhole = require('stream-wormhole')
      const stream = await this.ctx.getFileStream({ requireFile: false })
      const fields = stream.fields || {}
      data.body = fields
      await sendToWormhole(stream)
    }

    const { params, method, headers = {} } = api.options
    delete api.options.params.path
    let headersParams = headers.params || []
    params.headers = headersParams

    let headersMap = {}
    headersParams.forEach((item) => {
      if (item && item.key) {
        headersMap[item.key.toLowerCase()] = item.example
      }
    })

    for (const name in params) {
      const rule = {}
      // get请求不校验body
      // if (method === 'get' && name === 'body') continue
      params[name].forEach(param => {
        // 参数不必填 && 发送的值为空字符串, 不校验
        if (!param.required) {
          let value = data[name] ? data[name][param.key] : ''
          if (!value) return
        }
        // 参数不存在 || 参数类型不属于基本类型，不校验
        if (!param.key || BASE_TYPES.indexOf(param.type) === -1) return
        if (name === 'headers') {
          let newKey = param.key.toLowerCase()
          let headerValue = headersMap[newKey]
          if (headerValue) {
            rule[newKey] = {
              type: 'string',
              required: true,
              format: new RegExp(headerValue)
            }
          }
        } else {
          let validateObj = {}
          validateObj = {
            type: this.getValidatorType(name, param.type),
            required: param.required,
            allowEmpty: param.type === 'string'
          }
          // 最大值校验
          let { maxLength } = param
          if (param.type === 'string' && maxLength > 0) {
            validateObj.max = maxLength
          }
          rule[param.key] = validateObj
        }
      })
      this.ctx.validate(rule, data[name])
    }
  }
}

module.exports = ClientController
