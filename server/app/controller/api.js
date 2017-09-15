const R = require('ramda')
const assert = require('http-assert')
const mongoose = require('mongoose')

module.exports = app => {
  class ApiController extends app.Controller {
    * getAll () {
      const { groupId } = this.ctx.params
      let { limit = 30, page = 1, q = '' } = this.ctx.query
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
      const users = q ? yield this.service.user.find(q) : []
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
        const groups = yield this.service.group.getReadableGroups()
        condition.group = {
          $in: groups.map(g => g._id)
        }
      }
      const resources = yield this.service.api.getRichList(condition, page, limit)
      const count = yield app.model.api.find(condition).count().exec()
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
    * judgeModifyRight (apiId, groupId, authId) {
      const authority = yield this.service.apiAuthority.get(apiId)
      const group = yield this.service.group.getById(groupId)

      this.judgeGroupRight(group, authId)
      this.judgeApiRight(authority, group, authId)
    }
    * modifyApi () {
      const { groupId, apiId } = this.ctx.params
      const { body } = this.ctx.request
      const authId = this.ctx.authUser._id
      const lastModifiedTime = body.modifiedTime

      assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
      assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

      yield this.judgeModifyRight(apiId, groupId, authId)

      delete body._id
      delete body.manager
      // 使用lean()方法会导致无法设定schema的默认值,minimize: false 为了防止清掉空对象
      const resources = (yield this.service.api.update(apiId, body)).toObject({ minimize: false })
      if (!resources) {
        this.error({
          code: '500',
          msg: '系统错误，保存失败'
        })
      }
      yield this.notifyApiChange(resources, lastModifiedTime)
      this.service.group.updateTime(groupId)
      // 存下历史记录，并将所有记录返回
      resources.history = yield this.service.apiHistory.push(resources)
      this.ctx.body = { resources }
    }
    * notifyApiChange (api, lastModifiedTime) {
      const interval = api.modifiedTime - lastModifiedTime
      if (interval < this.config.pushInterval.api) {
        return
      }
      const selfIdx = api.follower.findIndex(f => f.toString() === this.ctx.authUser._id)
      // 如果修改者也在关注列表中，不推送自己
      if (selfIdx >= 0) {
        api.follower.splice(selfIdx, 1)
      }
      const users = yield this.service.user.getByIds(api.follower)
      this.service.email.notifyApiChange(api, users)
    }
    * getApi () {
      const { groupId, apiId } = this.ctx.params

      assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
      assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

      const resources = (yield app.model.api.findOne({ _id: apiId, isDeleted: false })).toObject()
      resources.history = yield this.service.apiHistory.get(resources)

      this.ctx.body = { resources }
      this.ctx.status = 200
    }
    * follow () {
      const apiId = this.ctx.params.apiId
      const authId = this.ctx.authUser._id
      const api = (yield this.service.api.getById(apiId)).toObject()
      api.follower = api.follower || []
      const isExist = api.follower.find(f => f.toString() === authId)
      if (isExist) {
        this.ctx.body = api
      } else {
        api.follower.push(authId)
        this.ctx.body = yield this.service.api.update(apiId, {
          follower: api.follower
        })
      }
    }
    * unfollow () {
      const apiId = this.ctx.params.apiId
      const authId = this.ctx.authUser._id
      const api = (yield this.service.api.getById(apiId)).toObject()
      const index = api.follower.findIndex(f => f.toString() === authId)
      if (index < 0) {
        this.ctx.body = api
      } else {
        api.follower.splice(index, 1)
        this.ctx.body = yield this.service.api.update(apiId, {
          follower: api.follower
        })
      }
    }
    * getManageApi () {
      const { limit = 100, page = 1 } = this.ctx.query
      this.ctx.body = yield this.service.api.getManageList(page, limit)
    }
    * createApi () {
      const { groupId } = this.ctx.params
      const { body } = this.ctx.request

      assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
      assert(body.name, 403, 'required name')

      const group = yield this.service.group.getById(groupId)

      this.judgeGroupRight(group, this.ctx.authUser._id)

      const resources = yield this.service.api.create(R.merge(body, {
        group: groupId
      }))

      this.service.group.updateTime(groupId)

      this.ctx.body = { resources }
      this.ctx.status = 200
    }
    * createGroupApis () {
      const { groupId } = this.ctx.params
      const apis = this.ctx.request.body
      const rs = yield this.service.api.createApis(apis)
      this.service.group.updateTime(groupId)
      this.ctx.body = { apis: rs }
      this.ctx.status = 200
    }
    * delete () {
      const { groupId, apiId } = this.ctx.params

      assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
      assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

      const rs = yield this.service.api.delete(apiId)
      if (!rs) {
        this.error({
          code: 403,
          msg: '无权删除'
        })
      }
      yield app.model.group.update({ _id: groupId }, { modifiedTime: Date.now() }, { new: true }).exec()
      this.ctx.logger.info('deleteApi')
      this.ctx.status = 204
    }
  }
  return ApiController
}
