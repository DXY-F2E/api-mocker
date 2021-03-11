const Service = require('egg').Service
const { authority } = require('../../constants')
const {
  PRIVACY_ALL,
  PRIVACY_MEMBER,
  PRIVACY_SELF,
  OPERATION_ALL,
  OPERATION_MEMBER
} = authority

class Group extends Service {
  isWritable (group, authId) {
    switch (group.operation) {
      case OPERATION_ALL:
        return { status: true }
      case OPERATION_MEMBER:
        return {
          status: !!group.member.find(m => m.toString() === authId),
          msg: '仅组内成员可操作'
        }
      default:
        return { status: true }
    }
  }
  async getReadableGroups () {
    const authId = this.ctx.authUser._id
    const cond = {
      isDeleted: false,
      $or: [{
        privacy: null
      }, {
        privacy: PRIVACY_ALL
      }, {
        privacy: PRIVACY_MEMBER,
        member: authId
      }, {
        privacy: PRIVACY_SELF,
        manager: authId
      }]
    }
    return this.ctx.model.Group.find(cond).sort({ modifiedTime: -1, createTime: -1 })
  }
  async checkPrefixExist (id, prefix) {
    const group = await this.ctx.model.Group.findOne({ _id: { $ne: id }, prefix })
    return group
  }
  async update (groupId, group) {
    if (!group.name) throw new Error('分组名称不能为空')
    let config = {
      _id: groupId,
      manager: this.ctx.authUser._id
    }

    if (this.ctx.isManager) {
      delete config.manager
    }

    // 同组内name不能重复
    const query = group.pGroup
      ? { name: group.name, pGroup: group.pGroup, _id: { $ne: groupId } }
      : { name: group.name, pGroup: {$eq: null}, _id: { $ne: groupId } }
    const res = await this.ctx.model.Group.findOne(query)
    if (res) throw new Error('组名重复')

    return this.ctx.model.Group.findOneAndUpdate(config, Object.assign(group, { modifiedTime: Date.now() }), { new: true })
  }
  updateFollower (groupId, follower) {
    return this.ctx.model.Group.findOneAndUpdate(
      { _id: groupId },
      {
        follower,
        modifiedTime: Date.now()
      },
      { new: true }
    )
  }
  updateTime (groupId) {
    // 此方法允许异步执行
    return this.ctx.model.Group.findOneAndUpdate(
      { _id: groupId },
      { modifiedTime: Date.now() },
      { new: true }
    ).exec()
  }
  async create (group) {
    // 同组内name不能重复
    const query = group.pGroup
      ? { name: group.name, pGroup: group.pGroup }
      : { name: group.name, pGroup: {$eq: null} }
    const res = await this.ctx.model.Group.findOne(query)
    if (res) throw new Error('组名重复')
    const authId = this.ctx.authUser._id
    const _group = {
      name: group.name,
      creator: authId,
      manager: authId,
      follower: [authId]
    }
    if (group.pGroup) _group.pGroup = group.pGroup
    return this.ctx.model.Group(_group).save()
  }
  async getUserGroups (user, rights, query) {
    let {q, page, limit} = query
    let req = new RegExp(q, 'i')
    let config = {}
    let defaultConfig = {
      [rights]: user,
      isDeleted: false
    }
    page = Number(page)
    limit = Number(limit)
    let skip = (page - 1) * limit

    if (q.length !== 0) {
      Object.assign(config, { name: req }, defaultConfig)
    } else {
      Object.assign(config, defaultConfig)
    }
    if (this.ctx.isManager) {
      delete config[rights]
    }

    let count = await this.ctx.model.Group.find(config).count().exec()
    let resultsOrigin = await this.ctx.model.Group.find(config).sort({
      createTime: -1
    }).skip(skip).limit(limit)

    let resultsP = resultsOrigin.map((item) => {
      const resP = this.ctx.model.Group.aggregate([
        {$match: {_id: item._id}},
        {
          $graphLookup: {
            from: 'groups',
            startWith: '$pGroup',
            connectFromField: 'pGroup',
            connectToField: '_id',
            as: 'parent'
          }
        }
      ])
      return resP
    })

    let results = []
    for (let p of resultsP) {
      const res = await p
      results.push(res[0])
    }

    return {results, count}
  }
  getById (groupId) {
    return this.ctx.model.Group.findOne({
      _id: groupId
    })
  }
  async delete (groupId) {
    const group = await this.getById(groupId)
    const child = await this.ctx.model.Group.findOne({ isDeleted: false, pGroup: groupId })
    if (child) throw new Error('该分组存在子分组，无法删除')
    return this.ctx.model.Group.findOneAndUpdate({
      _id: groupId,
      manager: this.ctx.authUser._id
    }, {
      modifiedTime: Date.now(),
      name: `${group.name}_已删除_${group._id}`,
      isDeleted: true
    })
  }
  getManageGroup (query) {
    return this.getUserGroups(this.ctx.authUser._id, 'manager', query)
  }
  getUnmanaged (query) {
    return this.getUserGroups(null, 'manager', query)
  }
  async getGroup (groupId) {
    const group = await this.ctx.model.Group.findOne({ _id: groupId })
    return group
  }
  claim (groupId) {
    return this.ctx.model.Group.findOneAndUpdate({
      _id: groupId,
      manager: null
    }, {
      modifiedTime: Date.now(),
      manager: this.ctx.authUser._id
    })
  }
  async checkIfExistNameInGroup (groupId, name) {
    const res = await this.ctx.model.Api.findOne({ name, group: groupId, isDeleted: false })
    return Boolean(res)
  }
  async checkIfExistUrlInGroup (groupId, url, method, apiId) {
    let params = { url, group: groupId, isDeleted: false, 'options.method': method }
    if (apiId) params = { ...params, _id: { $ne: apiId } }
    if (url.includes(':')) {
      // 带restful路径参数
      const regex = url.replace(/:[^/]*?(?=(\/|$))/g, ':[^/]*?')
      params = { ...params, url: { $regex: `^${regex}$` } }
    }
    const res = await this.ctx.model.Api.findOne(params)
    return Boolean(res)
  }
}

module.exports = Group
