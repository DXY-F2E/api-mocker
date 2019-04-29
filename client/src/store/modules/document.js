/**
 * document 文档的状态维护
 * 用于编辑页/文档页
 */
import axios from 'axios'
import R from 'ramda'
import Api from '@/model/api'
import Schema from '@/model/schema'
import APIs from '@/config/api'
import { buildApiResponse, validateApi } from '@/util'

const state = {
  api: {...Api()},
  apiUnsaved: false,
  mode: 'edit',
  reqParams: {
    query: {
      value: {},
      params: []
    },
    body: {
      value: {},
      params: []
    },
    path: {
      value: {},
      params: []
    }
  },
  response: {},
  dslStatus: {
    success: true,
    msg: ''
  },
  diffMode: false,
  diffStack: null
}

const actions = {
  getApi ({ commit }, payload) {
    const { groupId, apiId } = payload
    return axios.get(APIs.API.replace(':groupId', groupId).replace(':apiId', apiId)).then(res => {
      const api = buildApiResponse(res.data.resources)
      commit('UPDATE_API', api)
      commit('SAVE_API')
    })
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
  updateApi ({ state, commit }) {
    const api = state.api
    const { group, _id } = api
    return axios.put(APIs.API.replace(':groupId', group).replace(':apiId', _id), api).then(res => {
      commit('UPDATE_API', res.data.resources)
      commit('SAVE_API')
      return res
    })
  },
  createApi ({ state, commit }) {
    return axios.post(APIs.GROUP_APIS.replace(':groupId', state.api.group), state.api).then(res => {
      commit('UPDATE_API', res.data.resources)
      commit('SAVE_API')
      return res
    })
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

const mutations = {
  INIT_API (state, groupId) {
    state.api = Api()
    state.api.group = groupId
  },
  UPDATE_API (state, data) {
    state.api = { ...data }
    state.apiUnsaved = true
  },
  SAVE_API (state) {
    state.apiUnsaved = false
  },
  CHANGE_MODE (state, mode) {
    state.mode = mode || (state.mode === 'edit' ? 'test' : 'edit')
  },
  UPDATE_RESPONSE (state, res) {
    state.response = res
  },
  UPDATE_API_PROPS (state, propValuePair) {
    const api = state.api || {}
    const prop = R.head(propValuePair)
    const value = R.last(propValuePair)
    const route = prop.split('.').map(p => {
      if (Number(p).toString() === p) {
        return Number(p)
      } else {
        return p
      }
    })
    state.api = R.assocPath(route, value, api)
    state.apiUnsaved = true
  },
  DELETE_API_RESPONSE (state, index) {
    const options = state.api.options
    options.response.splice(index, 1)
    if (options.responseIndex >= index && index !== 0) {
      options.responseIndex--
    }
  },
  ADD_API_RESPONSE (state, index = -1) {
    if (index !== -1) {
      let copyData = JSON.parse(JSON.stringify(state.api.options.response[index]))
      state.api.options.response.push(copyData)
    } else {
      state.api.options.response.push(new Schema(state.api.options.response.length + 1))
    }
  },
  UPDATE_DSL_STATUS (state, status) {
    state.dslStatus = status
  },
  // diff相关
  UPDATE_DIFF_MODE (state, status) {
    state.diffMode = status
  },
  UPDATE_DIFF_STACK (state, stack) {
    state.diffStack = stack
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
