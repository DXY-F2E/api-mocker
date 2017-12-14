const R = require('ramda')
const assert = require('http-assert')
const mongoose = require('mongoose')
const AbstractController = require('./abstract')

class ApiController extends AbstractController {
  async getAll () {
    const { groupId } = this.ctx.params
    let { limit = 30, page = 1, q = '', order = '{}' } = this.ctx.query
    order = JSON.parse(order)
    page = Number(page)
    limit = Number(limit)
    const condition = { isDeleted: false }
    // 超过一个字符才会去匹配
    if (q && q.length >= 2) {
      const reg = new RegExp(`.*${q}.*`, 'i')
      condition.$or = [
        { name: reg },
        { desc: reg },
        { prodUrl: reg },
        { devUrl: reg }
      ]
      // 符合objectId的话，添加id的查询
      if (q.match(/^[0-9a-fA-F]{24}$/)) {
        condition.$or.unshift({_id: q})
      }
    }
    const users = q ? await this.service.user.find(q) : []
    if (users.length) {
      condition.$or.push({
        manager: {
          $in: users.map(u => u._id)
        }
      })
    }
    // 传了groupId 则选择分组下的api,没有的话，先获取可见的分组，再去读取api
    if (groupId) {
      condition.group = groupId
    } else {
      const groups = await this.service.group.getReadableGroups()
      condition.group = {
        $in: groups.map(g => g._id)
      }
    }
    const resources = await this.service.api.getRichList(condition, page, limit, order)
    const count = await this.ctx.model.Api.find(condition).count().exec()
    this.ctx.body = { resources, pages: { limit, page, count } }
    this.ctx.status = 200
  }
  judgeGroupRight (group, authId) {
    const { status, msg } = this.service.group.isWritable(group, authId)
    if (status) {
      return true
    }
    this.error(msg)
  }
  judgeApiRight (authority, group, authId) {
    const { status, msg } = this.service.apiAuthority.isWritable(authority, group, authId)
    if (status) {
      return true
    }
    this.error(msg)
  }
  async judgeModifyRight (apiId, groupId, authId) {
    const authority = await this.service.apiAuthority.get(apiId)
    const group = await this.service.group.getById(groupId)

    this.judgeGroupRight(group, authId)
    this.judgeApiRight(authority, group, authId)
  }
  async modifyApi () {
    const { groupId, apiId } = this.ctx.params
    const { body } = this.ctx.request
    const authId = this.ctx.authUser._id
    const lastModifiedTime = body.modifiedTime

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
    assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

    await this.judgeModifyRight(apiId, groupId, authId)

    delete body._id
    delete body.manager
    const currentApi = await this.service.api.getById(apiId)
    // 使用lean()方法会导致无法设定schema的默认值,minimize: false 为了防止清掉空对象
    const resources = (await this.service.api.update(apiId, body)).toObject({ minimize: false })
    if (!resources) {
      this.error({
        code: '500',
        msg: '系统错误，保存失败'
      })
    }
    const group = await this.service.group.updateTime(groupId)
    // 存下历史记录，并将所有记录返回
    resources.history = await this.service.apiHistory.push(currentApi)
    this.notifyApiChange(group, resources, lastModifiedTime)
    this.ctx.body = { resources }
  }
  async notifyApiChange (group, api, lastModifiedTime) {
    const interval = api.modifiedTime - lastModifiedTime
    if (interval < this.config.pushInterval.api) {
      return
    }
    let follower = api.follower.concat(group.follower).map(f => f.toString())
    follower = Array.from(new Set(follower))
    const selfIdx = follower.findIndex(f => f === this.ctx.authUser._id)
    // 如果修改者也在关注列表中，不推送自己
    if (selfIdx >= 0) {
      follower.splice(selfIdx, 1)
    }
    const users = await this.service.user.getByIds(follower)
    this.service.email.notifyApiChange(api, users)
  }
  async notifyApi (act, group, api) {
    const selfIdx = group.follower.findIndex(f => f.toString() === this.ctx.authUser._id)
    // 如果修改者也在关注列表中，不推送自己
    if (selfIdx >= 0) {
      group.follower.splice(selfIdx, 1)
    }
    const users = await this.service.user.getByIds(group.follower)
    this.service.email[`notifyApi${act}`](group, api, users)
  }
  async getApi () {
    const { groupId, apiId } = this.ctx.params

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
    assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

    const resources = (await this.ctx.model.Api.findOne({ _id: apiId, isDeleted: false })).toObject()
    resources.history = await this.service.apiHistory.get(resources)

    this.ctx.body = { resources }
    this.ctx.status = 200
  }
  async follow () {
    const apiId = this.ctx.params.apiId
    const authId = this.ctx.authUser._id
    const api = (await this.service.api.getById(apiId)).toObject()
    api.follower = api.follower || []
    const isExist = api.follower.find(f => f.toString() === authId)
    if (isExist) {
      this.ctx.body = api
    } else {
      api.follower.push(authId)
      this.ctx.body = await this.service.api.update(apiId, {
        follower: api.follower
      })
    }
  }
  async unfollow () {
    const apiId = this.ctx.params.apiId
    const authId = this.ctx.authUser._id
    const api = (await this.service.api.getById(apiId)).toObject()
    const index = api.follower.findIndex(f => f.toString() === authId)
    if (index < 0) {
      this.ctx.body = api
    } else {
      api.follower.splice(index, 1)
      this.ctx.body = await this.service.api.update(apiId, {
        follower: api.follower
      })
    }
  }
  async getManageApi () {
    const { limit = 100, page = 1 } = this.ctx.query
    this.ctx.body = await this.service.api.getManageList(page, limit)
  }
  async createApi () {
    const { groupId } = this.ctx.params
    const { body } = this.ctx.request

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
    assert(body.name, 403, 'required name')

    const group = await this.service.group.getById(groupId)

    this.judgeGroupRight(group, this.ctx.authUser._id)

    const resources = await this.service.api.create(R.merge(body, {
      group: groupId
    }))

    this.service.group.updateTime(groupId)
    this.notifyApi('Create', group, resources)
    this.ctx.body = { resources }
    this.ctx.status = 200
  }
  async createGroupApis () {
    const { groupId } = this.ctx.params
    const apis = this.ctx.request.body
    const rs = await this.service.api.createApis(apis)
    this.service.group.updateTime(groupId)
    this.ctx.body = { apis: rs }
    this.ctx.status = 200
  }
  async delete () {
    const { groupId, apiId } = this.ctx.params

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
    assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

    const rs = await this.service.api.delete(apiId)
    if (!rs) {
      this.error({
        code: 403,
        msg: '无权删除'
      })
    }
    const group = await this.service.group.updateTime(groupId)
    this.notifyApi('Delete', group, rs)
    this.ctx.logger.info('deleteApi')
    this.ctx.status = 204
  }
}
module.exports = ApiController
