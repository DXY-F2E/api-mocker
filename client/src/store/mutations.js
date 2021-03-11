import R from 'ramda'
import Vue from 'vue'

const mutations = {
  FETCH_GROUPS_SUCCESS (state, groups) {
    state.groups = groups
  },
  SET_CUR_GROUP (state, group) {
    state.curGroup = group
  },
  SEARCH_KEYWORD (state, { q }) {
    state.search.keyword = q
  },
  SEARCH_GROUPS_SUCCESS (state, listData) {
    state.search.groupList = listData
  },
  SEARCH_APIS_SUCCESS (state, listData) {
    state.search.apiList = listData
  },
  SEARCH_HISTORY_LIST_ADD (state, keyword) {
    let {searchHistoryList} = state.search
    if (searchHistoryList.length >= 20) {
      searchHistoryList.pop(searchHistoryList.length - 1)
    }
    searchHistoryList.unshift(keyword)
    state.search.searchHistoryList = searchHistoryList
  },
  SEARCH_HISTORY_LIST_DELETE (state, index) {
    let {searchHistoryList} = state.search
    searchHistoryList.splice(index, 1)
    state.search.searchHistoryList = searchHistoryList
  },
  SET_SEARCH_HISTORY_LIST (state, searchHistoryList) {
    state.search.searchHistoryList = searchHistoryList
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
    Vue.set(state.groups, index, group)
  },
  CREATE_GROUP_SUCCESS (state, data) {
    state.groups.unshift(data)
  },
  SET_GROUP_DETAIL (state, data) {
    state.groupDetail = data || {}
  },
  GET_GROUP_API (state, data) {
    state.apiList = data
  },
  UPDATE_API_PAGE (state, data) {
    state.apiPage = data
  },
  DELETE_API (state, apiIdx) {
    state.apiList.splice(apiIdx, 1)
  },
  UPDATE_REQ_PARAMS (state, { type, params, value }) {
    state.reqParams[type] = {
      params,
      value
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
