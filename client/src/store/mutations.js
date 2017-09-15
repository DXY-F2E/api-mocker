import { apiInitData } from '@/util'
import Schema from '@/model/schema'
import R from 'ramda'

const mutations = {
  FETCH_GROUPS_SUCCESS (state, groups) {
    state.groups = groups
  },
  INSERT_APIS (state, apis) {
    state.apiList = apis.concat(state.apiList)
  },
  INSERT_API (state, api) {
    state.apiList.unshift(api)
  },
  FETCH_SUCCESS (state, data) {
    state.apiList = data.resources
    state.apiPage = data.pages
    state.apiListSuccess = true
    state.apiListLoading = false
  },
  FETCH_BEGIN (state) {
    state.apiListLoading = true
  },
  FETCH_FAILED (state) {
    state.apiListLoading = false
    state.apiListSuccess = false
  },
  UPDATE_GROUP (state, group) {
    const index = R.findIndex(g => g._id === group._id)(state.groups)
    state.groups[index] = group
  },
  CREATE_GROUP_SUCCESS (state, data) {
    state.groups.unshift(data)
  },
  GET_GROUP_API (state, data) {
    state.apiList = data
  },
  INIT_API (state, groupId) {
    state.api = apiInitData()
    state.api.group = groupId
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
  SAVE_API (state) {
    state.apiUnsaved = false
  },
  UPDATE_API (state, data) {
    state.api = data
    state.apiUnsaved = true
  },
  UPDATE_API_PAGE (state, data) {
    state.apiPage = data
  },
  DELETE_API (state, apiIdx) {
    state.apiList.splice(apiIdx, 1)
  },
  UPDATE_DSL_STATUS (state, status) {
    state.dslStatus = status
  },
  CHANGE_MODE (state, mode) {
    state.mode = mode || (state.mode === 'edit' ? 'test' : 'edit')
  },
  UPDATE_REQ_PARAMS (state, {type, params, value}) {
    state.reqParams[type] = {
      params,
      value
    }
  },
  UPDATE_RESPONSE (state, res) {
    state.response = res
  },
  ADD_API_RESPONSE (state) {
    state.api.options.response.push(new Schema(state.api.options.response.length + 1))
  },
  DELETE_API_RESPONSE (state, index) {
    const options = state.api.options
    options.response.splice(index, 1)
    if (options.responseIndex >= index && index !== 0) {
      options.responseIndex --
    }
  },
  SET_USER (state, user) {
    state.user = user
  },
  UPDATE_PREVIEW_APIS (state, data) {
    state.previewApis = data
  },
  UPDATE_WINDOW_WIDTH (state, width) {
    state.windowWidth = width
  },
  SET_ALL_USERS (state, users) {
    state.allUsers = users
  }
}
export default mutations
