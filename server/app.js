module.exports = app => {
  class AbstractController extends app.Controller {
    success (data) {
      this.ctx.status = 200
      this.ctx.body = data
    }
    fail (msg) {
      // 弃用
      this.ctx.body = {
        success: false,
        msg
      }
    }
    error (data, code = 403) {
      if (typeof data === 'string') {
        this.ctx.throw(code, data)
      } else {
        this.ctx.throw(data.code, data.msg)
      }
    }
    notFound (msg) {
      msg = msg || 'not found'
      this.ctx.throw(404, msg)
    }
  }

  app.Controller = AbstractController

  // 数字校验-允许提交字符串格式的数字
  app.validator.addRule('unstrict_number', (rule, value) => {
    if (value && !isNaN(value)) {
      value = Number(value)
    }
    if (typeof value !== 'number') {
      return 'should be a number'
    }
  })
  app.validator.addRule('unstrict_boolean', (rule, value) => {
    if (typeof value === 'boolean') return
    if (value === 'false' || value === 'true') return
    return 'should be a boolean'
  })
}
