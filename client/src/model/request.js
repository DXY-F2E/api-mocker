import Schema from './schema'
/** 接口请求 模型
 *    method 请求方法，
 *    prodUrl 生产环境地址
 *    devUrl 开发环境地址
 *    body 请求体
 *    query 请求参数
 *    headers 请求头
 */
class Request {
  constructor (reqDoc) {
    const { method, prodUrl, devUrl, body, query, headers } = reqDoc
    this.method = method
    this.prodUrl = prodUrl
    this.devUrl = devUrl
    this.body = new Schema(body)
    this.query = new Schema(query)
    this.headers = new Schema(headers)
  }
}

export default Request
