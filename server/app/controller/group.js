const assert = require('http-assert')
const AbstractController = require('./abstract')

class GroupController extends AbstractController {
  async update () {
    const { id } = this.ctx.params
    const group = this.ctx.request.body
    delete group._id
    const rs = await this.service.group.update(id, group)
    if (rs && rs._id) {
      this.success(rs)
    } else {
      this.error('更新失败')
    }
  }
  async getAll () {
    const resources = await this.service.group.getReadableGroups()
    this.ctx.body = { resources }
    this.ctx.status = 200
  }
  async get () {
    let { limit = 20, page = 1, q = '.*' } = this.ctx.query
    page = Number(page)
    limit = Number(limit)
    const reg = new RegExp(`.*${q}.*`, 'i')
    const cond = {
      isDeleted: false,
      name: reg
    }
    const resources = await this.ctx.model.Group
      .find(cond)
      .sort({ modifiedTime: -1, createTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()
    const count = await this.ctx.model.Group.find(cond).count().exec()
    this.ctx.body = { resources, pages: { limit, page, count } }
    this.ctx.status = 200
  }
  async getManageGroup () {
    this.ctx.body = await this.service.group.getManageGroup()
  }
  async getUnmanaged () {
    this.ctx.body = await this.service.group.getUnmanaged()
  }
  async claim () {
    // 认领分组，历史遗留问题，可忽略此接口
    const groupId = this.ctx.params.id
    this.ctx.body = await this.service.group.claim(groupId)
  }
  async create () {
    const { body } = this.ctx.request
    assert(body.name, 403, 'required group name')
    const resources = await this.service.group.create(body)
    this.ctx.body = { resources }
  }
  async delete () {
    const { id } = this.ctx.params
    const rs = await this.service.group.delete(id)
    if (!rs) {
      this.error('无权删除')
    }
    // 不是很合理，应该是要先删除api再删除分组，但api这里没法做权限，所以暂时先后执行
    await this.service.api.deleteGroupApis(id)
    this.ctx.status = 204
  }

  async follow () {
    const groupId = this.ctx.params.groupId
    const authId = this.ctx.authUser._id
    const group = (await this.service.group.getById(groupId)).toObject()
    group.follower = group.follower || []
    const isExist = group.follower.find(f => f.toString() === authId)
    if (isExist) {
      this.ctx.body = group
    } else {
      group.follower.push(authId)
      this.ctx.body = await this.service.group.updateFollower(groupId, group.follower)
    }
  }
  async unfollow () {
    const groupId = this.ctx.params.groupId
    const authId = this.ctx.authUser._id
    const group = (await this.service.group.getById(groupId)).toObject()
    const index = group.follower.findIndex(f => f.toString() === authId)
    if (index < 0) {
      this.ctx.body = group
    } else {
      group.follower.splice(index, 1)
      this.ctx.body = await this.service.group.updateFollower(groupId, group.follower)
    }
  }
}

module.exports = GroupController
