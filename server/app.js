const md5 = require('blueimp-md5')
const core = require('./config/core')
const { md5Key } = core()
const manager = require('./config/manager')
const managerConfig = { ...manager, password: md5(manager.password, md5Key) }

module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext()
    try {
      let initManager = await ctx.model.User.findOne(managerConfig)
      if (initManager) {
        console.log('super manager has existed')
      } else {
        await ctx.model.User.create(managerConfig)
        console.log(`super manager user create success!`)
      }
    } catch (err) {
      console.warn(`super manager user create fail! \n`, err)
    }
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
