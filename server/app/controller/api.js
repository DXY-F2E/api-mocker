const R = require('ramda')
const assert = require('http-assert')
const mongoose = require('mongoose')
const AbstractController = require('./abstract')
const util = require('../public/util')
const importSwagger = require('../public/importSwagger')
const importOrigin = require('../public/importOrigin')
const axios = require('axios')

const BASE_TYPES = ['string', 'number', 'boolean', 'object', 'array']

class ApiController extends AbstractController {
  async query () {
    const { groupId } = this.ctx.params
    let _count = 0 // 用于后面查询作者计数
    let { limit = 30, page = 1, q = '', order = '{}' } = this.ctx.query
    order = JSON.parse(order)
    page = Number(page)
    limit = Number(limit)
    const condition = { isDeleted: false }

    // 传了groupId 则选择分组下的api,没有的话，先获取可见的分组，再去读取api
    if (groupId) {
      condition.group = groupId
    } else {
      const groups = await this.service.group.getReadableGroups()
      condition.group = {
        $in: groups.map(g => g._id)
      }
    }
    let {resources, count} = await this.queryApis(q, condition, page, limit, order)
    // 第一次搜索不到而且有可用分词, 进行分词搜索
    if (count === 0 && q.includes(' ')) {
      let wordList = util.parseWord(q)
      if (wordList.length > 0) {
        let result = await this.queryApis(q, condition, page, limit, order, wordList)
        resources = result.resources
        count = result.count
      }
    }

    if (resources.length) {
      await new Promise((resolve, reject) => {
        try {
          resources.forEach((item, index, arr) => {
            this.service.user.getById(item.creator || (item.manager && item.manager.id)).lean().then(v => {
              _count++
              resources[index].author = (v && v.name) || ''
              if (_count === resources.length) {
                resolve()
              }
            })
          })
        } catch (e) {
          reject(e)
        }
      })
    }
    this.ctx.body = { resources, pages: { limit, page, count } }
    this.ctx.status = 200
  }
  async exportApi () {
    let {apiList} = this.ctx.request.body
    let condition = {_id: apiList.length === 1 ? apiList[0] : {$in: apiList}}
    let resources = await this.service.api.getSimpleList(condition)
    this.ctx.body = {resources}
  }
  async queryApis (q, condition, page, limit, order, wordList) {
    condition.$or = []
    condition.$and = []
    if (q && q.length > 1) {
      // 传wordList进行分词搜索, 不传进行普通搜索
      if (wordList && wordList.length) {
        for (let i = 0; i < wordList.length; i++) {
          let word = wordList[i]
          const reg = new RegExp(`.*${word}.*`, 'i')
          let $or = [{ name: reg }, { prodUrl: reg }, { devUrl: reg }, { url: reg }]
          // 关键词符合hash, 则加入根据id搜索的条件
          word.match(/^[ 0-9a-fA-F]{24}$/) && $or.unshift({ _id: word })
          // 如果根据关键词能搜到用户名, 则加入根据用户匹配的条件
          const users = q && q.length > 1 ? await this.service.user.find(word) : []
          users.length && $or.push({manager: {$in: users.map(u => u._id)}})
          // 拼接查询条件: 关键词在_id、name、prodUrl、devUrl、url之间是或逻辑, 多个关键词之间是与逻辑
          condition.$and.push({$or})
        }
      } else {
        const reg = new RegExp(`.*${q}.*`, 'i')
        condition.$or = [{ name: reg }, { prodUrl: reg }, { devUrl: reg }, { url: reg }]
        q.match(/^[0-9a-fA-F]{24}$/) && condition.$or.unshift({ _id: q })

        const users = q && q.length > 1 ? await this.service.user.find(q) : []
        users.length && condition.$or.push({manager: {$in: users.map(u => u._id)}})
      }
    }
    !condition.$or.length && delete condition.$or
    !condition.$and.length && delete condition.$and

    let resources = await this.service.api.getRichList(condition, page, limit, order)
    let count = await this.ctx.model.Api.find(condition).count().exec()
    return {resources, count}
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
  // 编辑接口
  async modifyApi () {
    const { groupId, apiId } = this.ctx.params
    const { body } = this.ctx.request
    const authId = this.ctx.authUser._id
    const lastModifiedTime = body.modifiedTime
    // 判断一下同组内接口路径是否重复
    const { url } = body
    if (url) {
      assert(body.url.startsWith('/'), 403, '接口路径请以/开头')
      assert(!body.url.endsWith('/'), 403, '接口路径不能以/结尾')
      const urlExsit = await this.service.group.checkIfExistUrlInGroup(groupId, url, body.options.method, apiId)
      assert(!urlExsit, 403, '接口路径已存在')
    }
    // 验证 example 是否与 schema 一致
    this.validateExample(body.options.response)

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalid groupId')
    assert(mongoose.Types.ObjectId.isValid(apiId), 403, 'invalid apiId')

    await this.judgeModifyRight(apiId, groupId, authId)

    delete body._id
    delete body.manager
    const currentApi = await this.service.api.getById(apiId)
    // 使用lean()方法会导致无法设定schema的默认值,minimize: false 为了防止清掉空对象
    const resources = (await this.service.api.update(apiId, body)).toObject({ minimize: false })
    if (!resources) {
      this.error({code: '500', msg: '系统错误，保存失败'})
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

    let resources = (await this.ctx.model.Api.findOne({ _id: apiId, isDeleted: false }))
    const user = await this.service.user.getById(resources.creator).lean()
    let author = user ? user.name : ''

    if (resources) {
      resources = resources.toObject({minimize: false})
      resources.history = await this.service.apiHistory.get(resources)
      resources = Object.assign({}, resources, {author: author})
      this.ctx.body = { resources }
      this.ctx.status = 200
    }
    this.ctx.status = resources ? 200 : 500
    this.ctx.body = resources ? { resources } : {'message': '该接口不存在或已经被删除'}
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
    const { limit = 16, page = 1, q = '' } = this.ctx.query
    let _page = Number(page)
    let _limit = Number(limit)
    const cond = {
      manager: this.ctx.authUser._id,
      isDeleted: false,
      limit: _limit,
      page: _page,
      q
    }
    let res = await this.service.api.getManageList(cond)
    this.ctx.body = res
  }
  async getApisByGroupManager () {
    const query = this.ctx.query
    this.ctx.body = await this.service.api.getApisByGroupManager(query)
  }
  // 复制接口
  async copyApi () {
    const { groupId } = this.ctx.params
    const { body } = this.ctx.request

    // 验证 example 是否与 schema 一致
    this.validateExample(body.options.response)

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')

    delete body.name
    delete body.url

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
  // 创建接口
  async createApi () {
    const { groupId } = this.ctx.params
    const { body } = this.ctx.request

    // 验证 example 是否与 schema 一致
    this.validateExample(body.options.response)

    assert(mongoose.Types.ObjectId.isValid(groupId), 403, 'invalie groupId')
    assert(body.name, 403, '请填写接口名称')

    // 校验name、url在当前group下是否已存在
    const nameExsit = await this.service.group.checkIfExistNameInGroup(groupId, body.name)
    assert(!nameExsit, 403, '接口名称已存在')

    // 填写了路径
    if (body.url) {
      assert(body.url.startsWith('/'), 403, '接口路径请以/开头')
      assert(!body.url.endsWith('/'), 403, '接口路径不能以/结尾')
      const urlExsit = await this.service.group.checkIfExistUrlInGroup(groupId, body.url, body.options.method)
      assert(!urlExsit, 403, '接口路径已存在')
    } else {
      assert(false, 403, '请填写接口路径')
    }

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
  refreshTimeStamp () {
    this.ctx.app.messenger.sendToAgent('refresh')
    this.success({ code: 200, message: '刷新成功' })
  }
  async autoImport () {
    const { groupId } = this.ctx.params
    const { token, devUrl = '', prodUrl = '', isOrigin } = this.ctx.request.body
    let param = { devUrl, prodUrl }
    let groupInfo = await this.service.group.getById(groupId)
    if (groupInfo && groupInfo.token && (groupInfo.token === token)) {
      await this.createGroupApis(isOrigin ? 'origin' : 'auto', groupInfo, param)
      // this.success({ message: '导入成功' })
    } else {
      this.error({ code: 403, message: 'token 校验失败，禁止自动导入' })
    }
  }
  async createGroupApis (type, group, param) {
    const { groupId } = this.ctx.params
    let {apis, importType, json} = this.ctx.request.body
    if (type === 'auto') {
      apis = importSwagger(json, group, param)
    }
    if (type === 'origin') {
      apis = importOrigin(json, group)
    }
    const res = await this.service.api.createApis({apis, importType, groupId})
    await this.service.group.updateTime(groupId)
    const addedApis = res
    const totalApis = apis
    const finalApis = totalApis.filter(api => api.id).concat(addedApis || [])
    const data = finalApis.map(api => `http://localhost:8080/#/doc/${api.group}/${api.id}`)
    if (importType === 0) {
      this.success({ message: `共${apis.length}条数据，已存在api共${apis.length - (res ? res.length : 0)}条，成功导入${res ? res.length : 0}条`, data })
    } else if (importType === 2) {
      this.success({ message: '导入成功', data })
    }
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
  validateExample (response = []) {
    for (let item of response) {
      let { example, params } = item
      this.validateParams(params, example)
    }
  }
  /**
   *
   * @param {Array} params - 验证规则数据
   * @param {Object} example - 要验证的数据
   * @param {String} parentKey - 上一级的 key
   */
  validateParams (params, example = {}, parentKey = '') {
    example = example || {}
    const rule = {}

    function getParentKey () {
      let key = parentKey.replace(/^\./, '').replace(/\.$/, '')
      return (key + '.').replace(/^\./, '')
    }

    // 验证是否有多余字段
    for (let i in example) {
      let keys = params.map(param => param.key)
      if (!keys.includes(i)) {
        this.error(`${getParentKey() + i} 未定义`)
      }
    }

    params.forEach(param => {
      // 参数不存在或者参数类型不属于基本类型时，不校验
      if (!param.key || BASE_TYPES.indexOf(param.type) === -1) return

      let data = example[param.key]
      let itemType = ''

      // 当数据不存在且该参数非必填，不用校验
      if (!data && !param.required) {
        return
      }

      // 如果是 array 类型
      if (param.type === 'array') {
        // 不是数组
        if (!Array.isArray(data)) {
          this.error(`${getParentKey() + param.key} 不是一个数组`)
        }

        // 空数组不验证
        if (!data.length) return

        let { type, params } = param.items
        itemType = type === 'undefined' ? '' : type

        if (itemType === 'object') {
          for (let item of data) {
            this.validateParams(params, item, `${parentKey}.${param.key}`)
          }
        }
      } else if (param.type === 'object') {
        // 数据不是 object
        if (typeof data !== 'object') {
          this.error(`${getParentKey() + param.key} 不是一个对象`)
        }
        // 如果是 object 类型，递归验证
        this.validateParams(param.params, data, `${parentKey}.${param.key}`)
      }

      rule[param.key] = {
        type: param.type,
        required: param.required,
        allowEmpty: param.type === 'string',
        itemType // 如果是数组，则需要此参数验证数组每一项
      }
    })

    try {
      this.ctx.validate(rule, example)
    } catch (err) {
      // 对错误进行格式化
      let { errors = [] } = err
      let message = errors.map(i => `’${getParentKey() + i.field}‘: ${i.message.replace('should be a', '应该是')}`).join(';')
      /* eslint no-throw-literal: off */
      this.error(message)
    }
  }

  async modifyApiStatus () {
    const { apiId } = this.ctx.params
    const { status } = this.ctx.request.body
    const isManager = await this.service.api.isManager(apiId)

    if (!isManager) {
      this.error('无权操作')
    }

    const rs = (await this.service.api.update(apiId, {status})).toObject({ minimize: false })

    if (!rs) {
      this.error('更新失败')
    } else {
      this.success('更新成功')
    }
  }

  validateProxyUrl (url) {
    return !(/(127.0.0.1)|(0.0.0.0)|(localhost)/.test(url))
  }

  async moveApis () {
    const { targetGroup, apis } = this.ctx.request.body
    try {
      await this.service.api.moveApis(targetGroup, apis)
      this.success({ message: '成功' })
    } catch (err) {
      this.success({ code: 500, message: '失败' })
    }
  }

  async customProxy () {
    const body = this.ctx.request.body
    if (!body.url.startsWith('http')) body.url = `http://${body.url}`
    if (!this.validateProxyUrl(body.url)) throw new Error('URL异常')
    try {
      const rsp = await axios.request({
        ...body
      })
      this.ctx.body = rsp.data
      this.ctx.status = 200
    } catch (err) {
      this.ctx.body = err
      this.ctx.status = 500
    }
  }
}
module.exports = ApiController
