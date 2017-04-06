import axios from 'axios';
import API from './api';
import config from '../../config';

const domain = process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax;

const actions = {
    getGroups({ commit }) {
        return axios.get(API.GROUPS).then(res => {
            commit('FETCH_GROUPS_SUCCESS', res.data.resources);
            return res.data.resources;
        });
    },
    createGroup({commit}, payload) {
        return axios.post(API.GROUPS, payload).then(response => {
            commit('CREATE_GROUP_SUCCESS', response.data.resources);
        });
    },
    getApiList: (() => {
        let searchLastTime = null;
        return ({ commit }, payload) => {
            commit('FETCH_BEGIN');
            const { groupId, query } = payload;
            const url = groupId ? API.GROUP_APIS.replace(':groupId', groupId) : API.APIS;
            const mytime = searchLastTime = Date.now();
            return axios.get(url, {
                params: query
            }).then(res => {
                if (searchLastTime === mytime) {
                    commit('FETCH_SUCCESS', res.data);
                    return res;
                }
            }).catch(err => {
                commit('FETCH_FAILED');
                throw err;
            });
        };
    })(),
    getGroupApi({ commit }, payload) {
        const { groupId } = payload;
        commit('FETCH_BEGIN');
        return axios.get(API.GROUP_APIS.replace(':groupId', groupId)).then((response) => {
            commit('FETCH_SUCCESS', response.data);
        }).catch(e => {
            commit('FETCH_FAILED');
            throw e;
        });
    },
    getApi({ commit }, payload) {
        const {groupId, apiId} = payload;
        return axios.get(API.API.replace(':groupId', groupId).replace(':apiId', apiId)).then(res => {
            commit('UPDATE_API', res.data.resources);
        });
    },
    deleteApi({ state, commit }, payload) {
        const { group, _id} = payload.api;
        return axios.delete(API.API.replace(':groupId', group).replace(':apiId', _id)).then(() => {
            commit('DELETE_API', payload.index);
        });
    },
    saveApi({ dispatch, state }) {
        if (state.api._id) {
            return dispatch('updateApi');
        } else {
            return dispatch('createApi');
        }
    },
    updateApi({ state, commit }) {
        const api = state.api;
        const { group, _id} = api;
        return axios.put(API.API.replace(':groupId', group).replace(':apiId', _id), state.api).then(res => {
            commit('UPDATE_API', res.data.resources);
        });
    },
    createApi({ state, commit }) {
        return axios.post(API.GROUP_APIS.replace(':groupId', state.api.group), state.api).then(res => {
            commit('UPDATE_API', res.data.resources);
        });
    },
    testApi({ state, commit }) {
        const api = state.api;
        const method = api.options.method;
        const config = {
            method: api.options.method,
            url: `${domain}${api.url}`
        };
        if (method === 'get' || method === 'delete') {
            config.params = state.reqParams;
        } else {
            config.data = state.reqParams;
        }
        return axios(config).then(res => {
            window.console.log(res);
            commit('UPDATE_RESPONSE', res.data);
        });
    }
};

export default actions;
