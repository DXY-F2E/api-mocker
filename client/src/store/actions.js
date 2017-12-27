import axios from 'axios'
import API from '@/config/api'
import {
    validateApi,
    buildApiResponse,
    buildExampleFromSchema,
    getDomain,
    catchError,
    buildRestUrl
} from '@/util'

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
    return axios.put(API.GROUP.replace(':groupId', group._id), group).then(res => {
      commit('UPDATE_GROUP', res.data)
      return res
    })
  },
  getGroups ({ commit }) {
    return axios.get(API.GROUPS).then(res => {
      commit('FETCH_GROUPS_SUCCESS', res.data.resources)
      return res
    })
  },
  getGroupList ({ commit }, query) {
    return axios.get(API.GROUPS, {
      params: query
    }).then(res => {
      commit('FETCH_GROUPS_SUCCESS', res.data.resources)
      return res
    }).catch(err => {
      throw err
    })
  },
  createGroup ({commit}, payload) {
    return axios.post(API.GROUPS, payload).then(response => {
      commit('CREATE_GROUP_SUCCESS', response.data.resources)
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
  getApi ({ commit }, payload) {
    const {groupId, apiId} = payload
    return axios.get(API.API.replace(':groupId', groupId).replace(':apiId', apiId)).then(res => {
      const api = buildApiResponse(res.data.resources)
      window.console.log(api)
      commit('UPDATE_API', api)
      commit('SAVE_API')
    })
  },
  getManageApi () {
    return axios.get(`${API.APIS}/manage`)
  },
  getManageGroup () {
    return axios.get(`${API.GROUPS}/manage`)
  },
  getUnmanagedGroup () {
    return axios.get(`${API.GROUPS}/unmanaged`)
  },
  claimGroup ({state}, groupId) {
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
  validateApi ({ state }) {
    return validateApi(state)
  },
  saveApi ({ dispatch, state }) {
    return validateApi(state).then(() => {
      if (state.api._id) {
        return dispatch('updateApi')
      } else {
        return dispatch('createApi')
      }
    }).catch(err => {
      throw err
    })
  },
  createApis ({ state, commit }, payload) {
    const { apis, groupId } = payload
    return axios.post(API.API.replace(':groupId', groupId).replace(':apiId', 'batch'), apis).then(res => {
      if (res.data.apis.length > 0) {
        res.data.apis = res.data.apis.map(a => {
          a.manager = state.user
          return a
        })
        commit('INSERT_APIS', res.data.apis)
      }
      return res
    })
  },
  updateApi ({ state, commit }) {
    const api = state.api
    const { group, _id } = api
    return axios.put(API.API.replace(':groupId', group).replace(':apiId', _id), api).then(res => {
      commit('UPDATE_API', res.data.resources)
      commit('SAVE_API')
      return res
    })
  },
  createApi ({ state, commit }) {
    return axios.post(API.GROUP_APIS.replace(':groupId', state.api.group), state.api).then(res => {
      commit('UPDATE_API', res.data.resources)
      commit('SAVE_API')
      return res
    })
  },
  copyApi ({ state, commit }, api) {
    return axios.post(API.GROUP_APIS.replace(':groupId', api.group), api).then(res => {
      res.data.resources.manager = state.user
      commit('INSERT_API', res.data.resources)
      return res
    })
  },
  testApi ({ state, commit }, testMode) {
    const api = state.api
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
      commit('UPDATE_RESPONSE', res)
    }, err => {
      window.console.log('testApi: error')
      window.console.log(err)
      if (err.response) {
        commit('UPDATE_RESPONSE', err.response)
      }
    }).catch(err => commit('UPDATE_RESPONSE', err))
  },
  getUser ({ state, commit }) {
    return state.user || axios.get(API.USER).then(res => {
      commit('SET_USER', res.data)
      return res.data
    })
  },
  searchUsers (_, query) {
    return axios.get(`${API.PROFILE}/search`, {
      params: {query}
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
  follow ({ state }, apiId) {
    return axios.put(API.API_FOLLOWER.replace(':apiId', apiId))
  },
  unfollow ({ state }, apiId) {
    return axios.delete(API.API_FOLLOWER.replace(':apiId', apiId))
  },
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
  sendResetPassCode ({ state }, email) {
    return axios.post(`${API.USER}/recovery/password/code`, {email})
  },
  sendResetPassTicket ({ state }, email) {
    return axios.post(`${API.USER}/recovery/password/ticket`, {email})
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
  // diff相关
  updateDiffMode ({ commit }, status) {
    return commit('UPDATE_DIFF_MODE', status)
  },
  // diff相关
  updateDiffStack ({ commit }, stack) {
    return commit('UPDATE_DIFF_STACK', stack)
  }
}

export default actions
