const Service = require('egg').Service
const { authority } = require('../../constants')
const {
  OPERATION_ALL,
  OPERATION_MEMBER,
  OPERATION_DESIGNEE
} = authority

class ApiAuthority extends Service {
  update (apiId, authority) {
    authority = (typeof authority === 'object') ? authority : {}
    authority.modifiedTime = Date.now()
    return this.ctx.model.ApiAuthority.findOneAndUpdate({
      apiId
    }, authority, {
      setDefaultsOnInsert: true,
      new: true,
      upsert: true
    })
  }
  get (apiId) {
    return this.ctx.model.ApiAuthority.findOne({
      apiId
    })
  }
  isWritable (authority, group, authId) {
    if (!authority) {
      return { status: true }
    }
    const { mode, operator } = authority.operation
    switch (mode) {
      case OPERATION_ALL:
        return { status: true }
      case OPERATION_MEMBER:
        return {
          status: !!group.member.find(m => m.toString() === authId),
          msg: '仅组内成员可操作'
        }
      case OPERATION_DESIGNEE:
        return {
          status: !!operator.find(o => o.toString() === authId),
          msg: '仅指定人员可操作'
        }
      default:
        return { status: true }
    }
  }
}

module.exports = ApiAuthority
