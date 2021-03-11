const assert = require('http-assert')
const AbstractController = require('./abstract')
const util = require('../public/util')
const user = require('../model/user')
class GroupController extends AbstractController {
  async update () {
    const { id } = this.ctx.params
    const group = this.ctx.request.body
    delete group._id
    if (group.prefix) {
      // prefix前后不能有/
      assert(!(group.prefix.startsWith('/') || group.prefix.endsWith('/')), 403, '组接口前缀不能以/开头或结尾')
      // 检查group prefix是否存在
      const prefixExist = await this.service.group.checkPrefixExist(id, group.prefix)
      assert(!prefixExist, 403, '组接口前缀已存在')
    }
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
  async getGroup () {
    const groupId = this.ctx.params.id
    const group = await this.service.group.getGroup(groupId)
    let user = null
    if (group.manager) {
      user = await this.service.user.getById(group.manager)
    }
    this.ctx.body = { group: { ...group._doc, managerName: user ? user.email : '' } }
    this.ctx.status = 200
  }

  async query () {
    let { limit = 20, page = 1, q = '.*' } = this.ctx.query
    page = Number(page)
    limit = Number(limit)
    const reg = new RegExp(`.*${q}.*`, 'i')
    const cond = { isDeleted: false }
    cond.$or = [{name: reg}]
    if (q.match(/^[ 0-9a-fA-F]{24}$/)) {
      cond.$or.push({ _id: q })
    }
    let result = await this.queryGroup(cond)
    // 第一次搜索不到而且有可用分词, 进行分词搜索
    if (result.count === 0 && q.includes(' ')) {
      let wordList = util.parseWord(q)
      if (wordList.length > 0) {
        delete cond.name
        cond.$and = wordList.map((word) => {
          return {name: new RegExp(`.*${word}.*`, 'i')}
        })
        result = await this.queryGroup(cond)
      }
    }
    let {resources, count} = result
    this.ctx.body = { resources, pages: { limit, page, count } }
    this.ctx.status = 200
  }
  async queryGroup (cond) {
    let { limit = 20, page = 1 } = this.ctx.query
    page = Number(page)
    limit = Number(limit)
    let resources = await this.ctx.model.Group.find(cond).populate('creator', ['_id', 'name'])
      .sort({ modifiedTime: -1, createTime: -1 }).skip((page - 1) * limit).limit(limit).exec()
    let count = await this.ctx.model.Group.find(cond).count().exec()

    let resultsP = resources.map((item) => {
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

    return {resources: results, count}
  }
  async getManageGroup () {
    let query = this.ctx.query
    this.ctx.body = await this.service.group.getManageGroup(query)
  }
  async getUnmanaged () {
    let query = this.ctx.query
    this.ctx.body = await this.service.group.getUnmanaged(query)
  }
  async import () {
    let {body} = this.ctx.request
    let {extraCookie, url} = body

    let {headers} = this.ctx
    delete headers.host // 提交的header.host是mocker的host，需要删除
    delete headers['content-length'] // mocker在线测试代理时，'content-length'客户端与代理端会不一致，故删除它
    if (extraCookie) {
      headers.cookie = extraCookie
    }
    const opts = {
      rejectUnauthorized: false, // 代理https请求时忽略证书校验
      headers,
      method: 'get'
    }
    const result = await this.ctx.curl(url, opts)
    this.ctx.status = result.status
    delete result.headers['content-encoding'] // 设置了gzip encoding的话，转发请求将会出错，先取消此请求头的返回
    delete result.headers['access-control-allow-origin'] // 开发环境不一定在api服务端这个允许头内，故将其删除，防止代理失败
    this.ctx.set(result.headers)
    this.ctx.body = result.data
  }
  async exportGroup () {
    const {groupId} = this.ctx.params
    let resources = await this.service.api.getSimpleList({group: groupId})
    this.ctx.body = {resources}
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
