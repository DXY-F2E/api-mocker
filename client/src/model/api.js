// import Request from './request'
// import Response from './response'
import Schema from './schema'
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

function initData () {
  return {
    prodUrl: null,
    devUrl: null,
    name: '',
    group: '',
    desc: null,
    creator: null,
    manager: null,
    follower: [],
    options: {
      proxy: {
        mode: 0
      },
      response: [new Schema()],
      responseIndex: 0,
      headers: {
        example: null,
        params: []
      },
      method: 'get',
      delay: 0,
      examples: {
        query: null,
        body: null,
        path: null
      },
      params: {
        query: [],
        body: [],
        path: []
      }
    }
  }
}
export default initData
