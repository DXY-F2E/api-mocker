import apiInit from './apiInitData';
import R from 'ramda';
const mutations = {
    FETCH_GROUPS_SUCCESS(state, groups) {
        state.groups = groups;
    },
    FETCH_SUCCESS(state, data) {
        state.apiList = data.resources;
        state.apiPage = data.pages;
        state.apiListSuccess = true;
        state.apiListLoading = false;
    },
    FETCH_BEGIN(state) {
        state.apiListLoading = true;
    },
    FETCH_FAILED(state) {
        state.apiListLoading = false;
        state.apiListSuccess = false;
    },
    CREATE_GROUP_SUCCESS(state, data) {
        state.groups = state.groups.concat(data);
    },
    GET_GROUP_API(state, data) {
        state.apiList = data;
    },
    INIT_API(state) {
        state.api = apiInit();
    },
    UPDATE_API_PROPS(state, propValuePair) {
        const api = state.api || {};
        const prop = R.head(propValuePair);
        const value = R.last(propValuePair);
        state.api = R.assocPath(prop.split('.'), value, api);
    },
    UPDATE_API(state, data) {
        state.api = data;
    },
    UPDATE_API_PAGE(state, data) {
        state.apiPage = data;
    },
    DELETE_API(state, apiIdx) {
        state.apiList.splice(apiIdx, 1);
    },
    UPDATE_DSL_STATUS(state, status) {
        state.isDslRight = status;
    },
    CHANGE_MODE(state, mode) {
        state.mode = mode || (state.mode === 'edit' ? 'test' : 'edit');
    },
    UPDATE_REQ_PARAMS(state, {type, params}) {
        state.reqParams[type] = params;
    },
    UPDATE_RESPONSE(state, res) {
        state.response = res;
    }
};
export default mutations;
