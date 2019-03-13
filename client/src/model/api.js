import Request from './request'
import Response from './response'
/** 接口文档 模型
 * 主要要素
 *  name 文档名称
 *  proxy 代理信息
 *  desc 文档描述
 *  request 请求（
 *    method 请求方法
 *    prodUrl 生产环境地址
 *    devUrl 开发环境地址
 *    body 请求体 Schema
 *    query 请求参数 Schema
 *    headers 请求头 Schema
 *  ）
 *  response 响应 (
 *    status_code 状态码
 *    status_text 状态内容
 *    body 响应体 Schema
 *  )
 */
class Api {
  constructor (apiDoc) {
    const { name, proxy, desc, request, response } = apiDoc
    this.name = name
    this.proxy = proxy
    this.desc = desc
    this.request = new Request(request)
    this.response = new Response(response)
  }
}

export default Api
