import axios from 'axios';
import API from './api';
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
    search: (() => {
        let searchLastTime = null;
        return function({ commit }, payload) {
            const { groupId, q } = payload;
            let req;
            const mytime = searchLastTime = Date.now();
            if (groupId) {
                req = axios.get(`${API.GROUP_APIS.replace(':groupId', groupId)}?q=${q}`);
            } else {
                req = axios.get(`${API.APIS}?q=${q}`);
            }
            commit('SEARCH_BEGIN');
            return req.then(response => {
                if (searchLastTime === mytime) {
                    commit('SEARCH_SUCCESS', response.data.resources);
                }
            }).catch(() => {
                commit('SEARCH_FAILED');
            });
        };
    })(),
    createGroup({commit}, payload) {
        return axios.post(API.GROUPS, payload).then(response => {
            commit('CREATE_GROUP_SUCCESS', response.data.resources);
        });
    },
    getApiList({ commit }, payload) {
        return axios.get(API.APIS, {
            params: payload
        }).then(res => {
            commit('INIT_API_LIST', res.data.resources);
            commit('UPDATE_API_PAGE', res.data.pages);
        });
    },
    getGroupApi({ commit }, groupId) {
        return axios.get(API.GROUP_APIS.replace(':groupId', groupId)).then((response) => {
            commit('GET_GROUP_API', response.data.resources);
        });
    },
    getApi({ commit }, params) {
        const {groupId, apiId} = params;
        return axios.get(API.API.replace(':groupId', groupId).replace(':apiId', apiId)).then(res => {
            commit('UPDATE_API', res.data.resources);
            // commit('MERGE_API');
        });
    },
    deleteApi({ state, commit }, payload) {
        const { group, _id} = payload.api;
        return axios.delete(API.API.replace(':groupId', group).replace(':apiId', _id)).then(() => {
            commit('DELETE_API', payload.index);
        });
    },
    updateApi({ state, commit }) {
        const api = state.api;
        const { group, _id} = api;
        return axios.put(API.API.replace(':groupId', group).replace(':apiId', _id), state.api).then(res => {
            commit('UPDATE_API', res.data.resources);
        });
    },
    saveApi({ dispatch, state }) {
        window.console.log('保存API');
        window.console.log(state.api);
        if (state.api._id) {
            return dispatch('updateApi');
        } else {
            return dispatch('createApi');
        }
    },
    createApi({ state, commit }) {
        return axios.post(API.GROUP_APIS.replace(':groupId', state.api.group), state.api).then(res => {
            commit('UPDATE_API', res.data.resources);
        });
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
