const Service = require('egg').Service
const mongoose = require('mongoose')
class Api extends Service {
  getByUrl (url, groupId) {
    const reg = new RegExp(`.*${url}.*`, 'i')
    const condition = {
      $or: [
        { prodUrl: reg },
        { devUrl: reg },
        { url: reg }
      ],
      isDeleted: false
    }
    if (groupId) {
      condition.group = groupId
    }
    return this.ctx.model.Api.findOne(condition).sort({ modifiedTime: -1 })
  }
  getBySpecificalUrl (url, groupId, apiId, method) {
    const condition = {url, isDeleted: false, group: groupId, '_id': {$ne: apiId}, 'options.method': method}
    return this.ctx.model.Api.findOne(condition)
  }
  getById (apiId) {
    return this.ctx.model.Api.findOne({
      _id: apiId,
      isDeleted: false
    })
  }
  apiExistedId (api, existedApis) {
    let id = ''
    let {options, url} = api
    let {method} = options
    let length = existedApis.length
    for (let i = 0; i < length; i++) {
      let existedApi = existedApis[i]
      if (existedApi.url === url && existedApi.options.method === method) {
        id = existedApi.id
        break
      }
    }
    return id
  }
  async createApis ({apis = [], importType, groupId}) {
    const authId = (this.ctx.authUser && this.ctx.authUser._id) || '5cf8b28e9269c862122be9ff'
    apis = apis.map(api => {
      api.creator = authId
      api.manager = authId
      api.follower = [authId]
      return api
    })
    if (importType === 1) {
      await this.ctx.model.Api.deleteMany({ group: groupId })
      return this.ctx.model.Api.insertMany(apis)
    } else {
      let existedApis = await this.ctx.model.Api.find({ group: groupId, isDeleted: false })
      let addedApis = []
      apis.forEach(async (api) => {
        let existedId = this.apiExistedId(api, existedApis)
        if (!existedId) {
          addedApis.push(api)
        } else if (importType === 2) {
          api.id = existedId
          await this.ctx.model.Api.findOneAndUpdate({ _id: existedId }, { $set: api })
        }
      })
      if (addedApis.length) {
        const res = await this.ctx.model.Api.insertMany(addedApis)
        return res
      } else {
        return null
      }
    }
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
    let isGroupManager = await this.isGroupManager(group)
    return isManager || isGroupManager
  }
  async isGroupManager (groupId) {
    if (this.ctx.isManager) return true

    return !!(await this.ctx.model.Group.findOne({
      _id: groupId,
      manager: this.ctx.authUser._id
    }))
  }
  async delete (apiId) {
    const isManager = await this.isManager(apiId)
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
  async getList (cond, page, limit, order = {}) {
    const res = this.ctx.model.Api
      .find(cond)
      .sort(Object.assign(order, { createTime: -1 }))
      .skip((page - 1) * limit)
      .limit(limit)
    return res
  }
  genSearchQueryFilter (cond, defaultFilter, defaultFilterCond) {
    let filter = {
      $or: [
        ...defaultFilter
      ],
      $and: [
        ...defaultFilterCond
      ]
    }
    return filter
  }
  genDefaultFilter (q) {
    let filterObj = []
    let req = new RegExp(q, 'i') // 模糊查询
    if (mongoose.Types.ObjectId.isValid(q)) { // 对于ObjectId类型的不传对应格式的会报错
      filterObj = [
        { name: req },
        { group: q },
        { _id: q },
        { creator: q }
      ]
    } else {
      filterObj = [
        { name: req },
        { 'options.method': q } // 部分嵌套查询
      ]
    }
    return filterObj
  }
  genDefaultCond (cond) {
    const defaultCondArr = ['group', 'manager', 'isDeleted']
    let defaultCond = {}
    defaultCondArr.forEach((item, index, arr) => {
      if (cond.hasOwnProperty(item)) {
        defaultCond[item] = cond[item]
      }
    })
    return defaultCond
  }
  genDefaultFilterCond (cond) {
    const defaultCondArr = ['group', 'manager', 'isDeleted']
    let defaultCond = []
    if (!this.ctx.isManager) {
      defaultCondArr.forEach((item, index, arr) => {
        if (cond.hasOwnProperty(item)) {
          defaultCond.push({
            [item]: cond[item]
          })
        }
      })
    } else {
      defaultCond.push({
        isDeleted: cond.isDeleted
      })
    }

    return defaultCond
  }
  async getManageList (cond, order = {}) {
    let { page, limit, q } = cond
    let results, count
    let defaultFilterCond = this.genDefaultFilterCond(cond)
    let defaultCond = this.genDefaultCond(cond)
    if (q.length !== 0) { // 搜索查询
      let defaultFilter = this.genDefaultFilter(q)
      let filter = this.genSearchQueryFilter(cond, defaultFilter, defaultFilterCond)
      results = await this.ctx.model.Api.find(filter).sort(Object.assign(order, { createTime: -1 })).skip((page - 1) * limit).limit(limit)
      count = await this.ctx.model.Api.find(filter).count().exec()
    } else {
      results = await this.getList(defaultCond, page, limit)
      count = await this.ctx.model.Api.find(defaultCond).count().exec()
    }
    const arrP = results.map(i => this.ctx.model.Group.aggregate([
      {$match: {_id: i.group}},
      {
        $graphLookup: {
          from: 'groups',
          startWith: '$pGroup',
          connectFromField: 'pGroup',
          connectToField: '_id',
          as: 'parent'
        }
      }
    ]))
    const resArr = await Promise.all(arrP)
    results = results.map((i, index) => ({
      ...i._doc,
      parent: resArr[index][0].parent
    }))
    return {results, count}
  }
  getApisByGroupManager (query) {
    let { q, groupId, page, limit } = query
    page = Number(page)
    limit = Number(limit)
    const cond = {
      group: groupId,
      isDeleted: false,
      page,
      limit,
      q
    }
    let res = this.getManageList(cond)
    return res
  }
  async getRichList (cond, page, limit, order) {
    const apis = (await this.getList(cond, page, limit, order)).map(a => a.toObject({minimize: false}))
    const userIds = apis.filter(a => a.manager).map(a => a.manager)
    const users = await this.service.user.getByIds(userIds)
    const usersMap = {}
    users.forEach(u => (usersMap[u._id] = u))
    return apis.map(api => {
      api.manager = usersMap[api.manager]
      return api
    })
  }
  async getSimpleList (cond) {
    return (await this.ctx.model.Api.find(cond)
      .select('prodUrl devUrl name desc url isDeleted options -_id'))
      .map(a => a.toObject({minimize: false}))
  }

  async moveApis (targetGroup, apis) {
    const items = await this.ctx.model.Api.find({ _id: { $in: apis } })
    const pArr = items.map(item => this.ctx.model.Api.update({ _id: item._id }, { $set: { group: targetGroup } }))
    for (let p of pArr) {
      await p
    }
  }
}

module.exports = Api
