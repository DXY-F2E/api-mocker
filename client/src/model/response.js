import Schema from './schema'
/** 接口请求 模型
 *    code 状态码
 *    text 状态内容
 *    body 响应体 Schema
 */
class Response {
  constructor (resDoc) {
    const { code, text, body } = resDoc
    this.code = code
    this.text = text
    this.body = new Schema(body)
  }
}

export default Response
