const Service = require('egg').Service

class Api extends Service {
  getByUrl (url, groupId) {
    const reg = new RegExp(`.*${url}.*`, 'i')
    const condition = {
      $or: [
        { prodUrl: reg },
        { devUrl: reg }
      ],
      isDeleted: false
    }
    if (groupId) {
      condition.group = groupId
    }
    return this.ctx.model.Api.findOne(condition).sort({ modifiedTime: -1 })
  }
  getById (apiId) {
    return this.ctx.model.Api.findOne({
      _id: apiId,
      isDeleted: false
    })
  }
  createApis (apis) {
    const authId = this.ctx.authUser._id
    apis = apis.map(api => {
      api.creator = authId
      api.manager = authId
      api.follower = [authId]
      return api
    })
    return this.ctx.model.Api.insertMany(apis)
  }
  create (api) {
    const authId = this.ctx.authUser._id
    api.creator = authId
    api.manager = authId
    api.follower = [authId]
    return this.ctx.model.Api(api).save()
  }
  update (apiId, api) {
    api.modifiedTime = Date.now()
    return this.ctx.model.Api.findOneAndUpdate({
      _id: apiId
    }, api, { new: true })
  }
  async isManager (apiId) {
    if (this.ctx.isManager) return true

    let api = await this.ctx.model.Api.findOne({
      _id: apiId
    }, { manager: 1, group: 1 })
    if (!api) return false

    let { group } = api
    let isManager = !!(await this.ctx.model.Api.findOne({
      _id: apiId,
      manager: this.ctx.authUser._id
    }))
    let isGroupManager = this.isGroupManager(group)
    return isManager || isGroupManager
  }
  async isGroupManager (groupId) {
    if (this.ctx.isManager) return true

    return !!(await this.ctx.model.Group.findOne({
      _id: groupId,
      manager: this.ctx.authUser._id
    }))
  }
  delete (apiId) {
    const isManager = this.isManager(apiId)
    if (!isManager) return false
    return this.ctx.model.Api.findOneAndUpdate({
      _id: apiId
    }, {
      modifiedTime: Date.now(),
      isDeleted: true
    })
  }
  deleteGroupApis (groupId) {
    return this.ctx.model.Api.update({
      group: groupId
    }, {
      modifiedTime: Date.now(),
      isDeleted: true
    }, { multi: true })
  }
  getList (cond, page, limit, order = {}) {
    return this.ctx.model.Api
      .find(cond)
      .sort(Object.assign(order, { modifiedTime: -1, createTime: -1 }))
      .skip((page - 1) * limit)
      .limit(limit)
  }
  getManageList (page, limit) {
    const cond = {
      manager: this.ctx.authUser._id,
      isDeleted: false
    }

    return this.getList(cond)
  }
  getApisByGroupManager (groupId) {
    const cond = {
      group: groupId,
      isDeleted: false
    }
    return this.getList(cond)
  }
  async getRichList (cond, page, limit, order) {
    const apis = (await this.getList(cond, page, limit, order)).map(a => a.toObject())
    const userIds = apis.filter(a => a.manager).map(a => a.manager)
    const users = await this.service.user.getByIds(userIds)
    const usersMap = {}
    users.forEach(u => (usersMap[u._id] = u))
    return apis.map(api => {
      api.manager = usersMap[api.manager]
      return api
    })
  }
}

module.exports = Api
