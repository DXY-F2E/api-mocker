import axios from 'axios';
import API from './api';

const actions = {
    getGroups({ commit }) {
        return axios.get(API.GROUPS).then(res => {
            commit('FETCH_GROUPS_SUCCESS', res.data.resources);
            return res.data.resources;
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
            commit('FETCH_BEGIN');
            return req.then(response => {
                if (searchLastTime === mytime) {
                    commit('FETCH_SUCCESS', response.data);
                }
            }).catch(() => {
                commit('FETCH_FAILED');
            });
        };
    })(),
    createGroup({commit}, payload) {
        return axios.post(API.GROUPS, payload).then(response => {
            commit('CREATE_GROUP_SUCCESS', response.data.resources);
        });
    },
    getApiList({ commit }, payload) {
        commit('FETCH_BEGIN');
        return axios.get(API.APIS, {
            page: 1,
            limit: 16,
            ...payload
        }).then(res => {
            commit('FETCH_SUCCESS', res.data);
        }).catch(err => {
            commit('FETCH_FAILED');
            throw err;
        });
    },
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
    }
};

export default actions;
