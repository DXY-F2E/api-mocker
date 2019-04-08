/**
 * document 文档的状态维护
 * 适用于编辑页
 */
import axios from 'axios'
import Api from '@/model/api'
import APIs from '@/config/api'
import { buildApiResponse } from '@/util'
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
  diffMode: false,
  diffStack: null
}

const actions = {
  getApi ({ commit }, payload) {
    const { groupId, apiId } = payload
    return axios.get(APIs.API.replace(':groupId', groupId).replace(':apiId', apiId)).then(res => {
      const api = buildApiResponse(res.data.resources)
      window.console.log(api)
      commit('UPDATE_API', api)
      commit('SAVE_API')
    })
  }
}

const mutations = {
  UPDATE_API (state, data) {
    state.api = { ...data }
    state.apiUnsaved = true
  },
  SAVE_API (state) {
    state.apiUnsaved = false
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
