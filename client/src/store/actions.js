import axios from 'axios';
import API from './api';
import apiInit from './apiInitData';
const isEmpty = function(val) {
    return val === undefined || val.trim() === '' || val === null;
};
const actions = {
    getGroups({ commit }) {
        return axios.get(API.GROUPS).then(res => {
            commit('INIT_GROUPS', res.data.resources);
            return res.data.resources;
        }, res => {
            window.console.log(res);
        });
    },
    createGroup({commit}, payload) {
        return axios.post(API.GROUPS, payload).then(response => {
            commit('CREATE_GROUP_SUCCESS', response.data.resources);
        });
    },
    getApiList({ commit }) {
        return axios.get(API.APIS).then(res => {
            commit('INIT_API_LIST', res.data.resources);
        });
    },
    getGroupApi({ commit }, groupId) {
        return axios.get(API.GROUP_APIS.replace(':groupId', groupId)).then((response) => {
            commit('GET_GROUP_API', { [groupId]: response.data.resources});
        });
    },
    getApi({ commit }, params) {
        const {groupId, apiId} = params;
        return axios.get(API.API.replace(':groupId', groupId).replace(':apiId', apiId));
    },
    updateApi({ state }) {
        const api = state.api;
        const { group, _id} = api;
        return axios.put(API.API.replace(':groupId', group).replace(':apiId', _id));
    },
    saveApi({ dispatch, state }) {
        if (state.api._id) {
            return dispatch('updateApi');
        } else {
            return dispatch('createApi');
        }
    },
    createApi({ state }) {
        return axios.post(API.GROUP_APIS.replace(':groupId', state.api));
    },
    initApi({ commit }) {
        commit('INIT_API', apiInit);
    },
    validateApi({ state }) {
        if (isEmpty(state.api.name)) {
            return {
                status: false,
                msg: '接口名不能为空'
            };
        } else if (isEmpty(state.api.group)) {
            return {
                status: false,
                msg: '接口分组不能为空'
            };
        } else {
            return {
                status: true
            };
        }
    }
};

export default actions;
