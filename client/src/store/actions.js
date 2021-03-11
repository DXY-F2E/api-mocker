import axios from 'axios'
import API from '@/config/api'
import {
  buildExampleFromSchema,
  getDomain,
  catchError,
  buildRestUrl
} from '@/util'
let Message = require('../../node_modules/element-ui/lib/message').default

// 允许跨域请求带上cookie
axios.defaults.withCredentials = true
axios.interceptors.response.use(null, catchError)

const domain = getDomain()
const buildTestParams = (api, type) => api.options.examples[type] || buildExampleFromSchema({
  example: null,
  params: api.options.params[type]
})

const actions = {
  updateGroup ({ commit }, group) {
    delete group.parents
    delete group.children
    return axios.put(API.GROUP.replace(':groupId', group._id), group).then(res => {
      commit('UPDATE_GROUP', res.data)
      return res
    })
  },
  moveApis ({ commit }, data) {
    return axios.post(API.MOVE_APIS, data)
  },
  // 获取全部分组
  getAllGroups ({ commit }) {
    return axios.get(API.GROUPS_ALL).then(res => {
      commit('FETCH_GROUPS_SUCCESS', res.data.resources)
      return res
    })
  },
  // 查询分组
  searchGroup ({ commit }, query) {
    // commit('SEARCH_KEYWORD', query)
    return axios.get(API.GROUPS, {
      params: query
    }).then(res => {
      commit('SEARCH_GROUPS_SUCCESS', res.data)
      return res
    }).catch(err => {
      throw err
    })
  },
  // 查询接口列表
  searchApi ({ commit }, query) {
    // commit('SEARCH_KEYWORD', query)
    return axios.get(API.APIS, {
      params: query
    }).then(res => {
      commit('SEARCH_APIS_SUCCESS', res.data)
      return res
    }).catch(err => {
      throw err
    })
  },
  createGroup ({ commit }, payload) {
    return axios.post(API.GROUPS, payload).then(response => {
      commit('CREATE_GROUP_SUCCESS', response.data.resources)
      return response
    })
  },
  getApiList: (() => {
    let searchLastTime = null
    return ({ commit }, payload) => {
      commit('FETCH_BEGIN')
      const { groupId, query } = payload
      const url = groupId ? API.GROUP_APIS.replace(':groupId', groupId) : API.APIS
      const mytime = searchLastTime = Date.now()
      return axios.get(url, {
        params: query
      }).then(res => {
        if (searchLastTime === mytime) {
          commit('FETCH_SUCCESS', res.data)
          return res
        }
      }).catch(err => {
        commit('FETCH_FAILED')
        throw err
      })
    }
  })(),
  getGroupApi ({ commit }, payload) {
    const { groupId } = payload
    commit('FETCH_BEGIN')
    return axios.get(API.GROUP_APIS.replace(':groupId', groupId)).then((response) => {
      commit('FETCH_SUCCESS', response.data)
    }).catch(e => {
      commit('FETCH_FAILED')
      throw e
    })
  },
  getManageApi ({commit}, payload) {
    let page = (payload && payload.page) || 1
    let limit = (payload && payload.limit) || 16
    let q = (payload && payload.q) || ''
    return axios.get(`${API.APIS}/manage`, {
      params: {
        page,
        limit,
        q
      }
    })
  },
  getApisByGroupManager ({ state }, query) {
    let { groupId } = query
    return axios.get(`${API.APIS}/:groupId/manage`.replace(':groupId', groupId), {
      params: query
    })
  },
  getManageGroup ({state}, query) {
    return axios.get(`${API.GROUPS}/manage`, {
      params: query
    })
  },
  getUnmanagedGroup ({state}, query) {
    return axios.get(`${API.GROUPS}/unmanaged`, {
      params: query
    })
  },
  claimGroup ({ state }, groupId) {
    return axios.put(`${API.GROUP.replace(':groupId', groupId)}/claim`)
  },
  getApiHistory ({ commit }, apiId) {
    return axios.get(API.API_HISTORY.replace(':apiId', apiId)).then(res => res.data)
  },
  deleteApi ({ state, commit }, payload) {
    const { group, _id } = payload.api
    return axios.delete(API.API.replace(':groupId', group).replace(':apiId', _id))
  },
  deleteGroup ({ state, commit }, groupId) {
    return axios.delete(API.GROUP.replace(':groupId', groupId))
  },
  createApis ({ state, commit }, payload) {
    const { apis, groupId, importType } = payload
    return axios.post(API.API.replace(':groupId', groupId).replace(':apiId', 'batch'), {apis, importType}).then(res => res)
  },
  copyApi ({ state, commit }, api) {
    return axios.post(API.GROUP_APIS_COPY.replace(':groupId', api.group), api).then(res => {
      res.data.resources.manager = state.user
      commit('INSERT_API', res.data.resources)
      return res
    })
  },
  importApi ({ state, commit }, param) {
    return axios.post(API.GROUP_IMPORT_APIS.replace(':groupId', param.groupId), param).then(res => res)
  },
  localDebugApi ({ state, commit }, url) {
    const api = state.doc.api
    let config = {
      method: api.options.method,
      url,
      params: {},
      data: {}
    }
    config.params = buildTestParams(api, 'query')
    config.data = Object.assign(config.data, buildTestParams(api, 'body'))
    config.headers = buildExampleFromSchema(api.options.headers)
    return axios.post(`${API.LOCAL_DEBUG}`, config).then(res => {
      commit('doc/SET_CUSTOM_PROXY_RESPONSE', res)
      commit('doc/SET_CUSTOM_PROXY_RESPONSE_DATA', res.data)
    }).catch((err) => {
      commit('doc/SET_CUSTOM_PROXY_RESPONSE', err.response)
      commit('doc/SET_CUSTOM_PROXY_RESPONSE_DATA', err.response.data)
    })
  },
  testApi ({ state, commit }, testMode) {
    const api = state.doc.api
    let config = {
      method: api.options.method,
      url: `${domain}/client/${api._id}`,
      params: {},
      data: {}
    }
    const paths = buildTestParams(api, 'path')
    if (testMode !== 'mock') {
      config = {
        method: 'post',
        url: `${domain}/client/real`,
        params: {},
        data: {
          _apiRealUrl: buildRestUrl(api[`${testMode}Url`], paths),
          _apiMethod: api.options.method
        }
      }
    } else {
      config.url = buildRestUrl(config.url, paths)
    }
    config.params = buildTestParams(api, 'query')
    config.data = Object.assign(config.data, buildTestParams(api, 'body'))
    config.headers = buildExampleFromSchema(api.options.headers)
    if (config.headers.Cookie) {
      // 由于安全策略，前端不能设置cookie，所以把cookie信息放其他的头中传送
      config.headers['api-cookie'] = config.headers.Cookie
      delete config.headers.Cookie
    }
    return axios(config).then(res => {
      commit('doc/UPDATE_RESPONSE', res)
    }, err => {
      Message.error({message: (err && err.msg) || '请求接口错误'})
      commit('doc/UPDATE_RESPONSE', err)
    }).catch(err => {
      Message.error({message: (err && err.msg) || '请求接口错误'})
      commit('doc/UPDATE_RESPONSE', err)
    })
  },
  /* 用户相关 */
  getUser ({ state, commit }) {
    return axios.get(API.USER).then(res => {
      commit('SET_USER', res.data)
      return res.data
    })
  },
  getGroup ({ commit }, groupId) {
    return axios.get(API.QUERY_GROUP.replace(':groupId', groupId)).then(res => {
      commit('SET_GROUP_DETAIL', res.data.group)
    })
  },
  searchUsers (_, query) {
    return axios.get(`${API.PROFILE}/search`, {
      params: { query }
    })
  },
  getAllUsers ({ commit }) {
    return axios.get(`${API.PROFILE}/search`).then(res => {
      commit('SET_ALL_USERS', res.data)
      return res
    })
  },
  register ({ commit }, user) {
    return axios.post(`${API.USER}/register`, user).then(res => {
      commit('SET_USER', res.data)
      return res
    })
  },
  dxyLogin ({ commit }, ticket) {
    return axios.post(`${API.USER}/dxy-login`, { ticket }).then(res => {
      commit('SET_USER', res.data)
      return res
    })
  },
  login ({ commit }, user) {
    return axios.post(`${API.USER}/login`, user).then(res => {
      commit('SET_USER', res.data)
      return res
    })
  },
  logout ({ commit }) {
    return axios.get(`${API.USER}/logout`).then(res => {
      commit('SET_USER', null)
      return res
    })
  },
  updateProfile ({ state, commit }, user) {
    return axios.put(`${API.PROFILE}`, user).then(res => {
      commit('SET_USER', res.data)
      return res
    })
  },
  // 订阅分组
  followGroup ({ state, commit }, groupId) {
    return axios.put(API.GROUP_FOLLOWER.replace(':groupId', groupId)).then(res => {
      commit('UPDATE_GROUP', res.data)
      return res
    })
  },
  unfollowGroup ({ state, commit }, groupId) {
    return axios.delete(API.GROUP_FOLLOWER.replace(':groupId', groupId)).then(res => {
      commit('UPDATE_GROUP', res.data)
      return res
    })
  },
  // 订阅接口
  follow ({ state }, apiId) {
    return axios.put(API.API_FOLLOWER.replace(':apiId', apiId))
  },
  unfollow ({ state }, apiId) {
    return axios.delete(API.API_FOLLOWER.replace(':apiId', apiId))
  },
  // 收藏分组
  addFavorite: async ({state, commit}, groupId) => {
    const { data } = await axios.post(API.USER_FAVORITE.replace(':groupId', groupId))
    // 更新用户信息，favorites
    commit('SET_USER', data)
    return data
  },
  removeFavorite: async ({state, commit}, groupId) => {
    const { data } = await axios.delete(API.USER_FAVORITE.replace(':groupId', groupId))
    // 更新用户信息，favorites
    commit('SET_USER', data)
    return data
  },
  exportGroup: async ({state}, groupId) => {
    let {data = {}} = await axios.post(API.GROUP_EXPORT.replace(':groupId', groupId)) || {}
    return data
  },
  exportApi: async ({ state }, apiList) => {
    let {data = {}} = await axios.post(API.API_EXPORT, { apiList }) || {}
    return data
  },
  sendResetPassCode ({ state }, email) {
    return axios.post(`${API.USER}/recovery/password/code`, { email })
  },
  sendResetPassTicket ({ state }, email) {
    return axios.post(`${API.USER}/recovery/password/ticket`, { email })
  },
  resetPass ({ state }, resetForm) {
    return axios.put(`${API.USER}/recovery/password`, resetForm)
  },
  updatePassword ({ commit }, resetForm) {
    return axios.put(`${API.PROFILE}/password`, resetForm).then(res => {
      commit('SET_USER', res.data)
      return res
    })
  },
  // stat 相关
  getMockStat ({ state }, query) {
    return axios.get(`${API.STAT}/mock`, {
      params: query
    })
  },
  // 权限相关
  getApiAuthority ({ state }, apiId) {
    return axios.get(API.API_AUTHORITY.replace(':apiId', apiId))
  },
  updateApiAuthority ({ state }, authoriry) {
    return axios.put(API.API_AUTHORITY.replace(':apiId', authoriry.apiId), authoriry)
  },
  updateApiStatus ({ state }, { status, apiId }) {
    return axios.put(API.API_STATUS.replace(':apiId', apiId), {status})
  }
}

export default actions
