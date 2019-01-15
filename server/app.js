const md5 = require('blueimp-md5')
const core = require('./config/core')
const { md5Key } = core()
const manager = require('./config/manager')
const managerConfig = { ...manager, password: md5(manager.password, md5Key) }

module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext()
    let initManager = await ctx.model.User.findOne(managerConfig)
    if (initManager) {
      await ctx.model.User.findOneAndRemove(managerConfig)
    }
    await ctx.model.User(managerConfig).save()
    console.warn(`super manager user create success!`)
  })
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
