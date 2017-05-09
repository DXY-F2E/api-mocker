import axios from 'axios';
import API from './api';
import config from '../../config';
import { validateApi } from '../util';

const domain = process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax;

const actions = {
    getGroups({ commit }) {
        return axios.get(API.GROUPS).then(res => {
            commit('FETCH_GROUPS_SUCCESS', res.data.resources);
            return res;
        });
    },
    getGroupList({ commit }, query) {
        return axios.get(API.GROUPS, {
            params: query
        }).then(res => {
            commit('FETCH_GROUPS_SUCCESS', res.data.resources);
            return res;
        }).catch(err => {
            throw err;
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
            commit('SAVE_API');
        });
    },
    deleteApi({ state, commit }, payload) {
        const { group, _id} = payload.api;
        return axios.delete(API.API.replace(':groupId', group).replace(':apiId', _id)).then(() => {
            commit('DELETE_API', payload.index);
        });
    },
    validateApi({ state }) {
        return validateApi(state);
    },
    saveApi({ dispatch, state }) {
        return validateApi(state).then(() => {
            if (state.api._id) {
                return dispatch('updateApi');
            } else {
                return dispatch('createApi');
            }
        }).catch(err => {
            throw err;
        });
    },
    updateApi({ state, commit }) {
        const api = state.api;
        const { group, _id} = api;
        return axios.put(API.API.replace(':groupId', group).replace(':apiId', _id), state.api).then(res => {
            commit('UPDATE_API', res.data.resources);
            commit('SAVE_API');
        });
    },
    createApi({ state, commit }) {
        return axios.post(API.GROUP_APIS.replace(':groupId', state.api.group), state.api).then(res => {
            commit('UPDATE_API', res.data.resources);
            commit('SAVE_API');
        });
    },
    testApi({ state, commit }, url) {
        const api = state.api;
        let config = {
            method: api.options.method,
            url: `${domain}${api.url}`,
            params: {},
            data: {}
        };
        if (url !== config.url) {
            config = {
                method: 'post',
                url: `${domain}/client/real`,
                params: {},
                data: {
                    realUrl: url,
                    method: api.options.method
                }
            };
        }
        config.params = state.reqParams.query.value;
        config.data = state.reqParams.body.value;
        return axios(config).then(res => {
            commit('UPDATE_RESPONSE', res);
        }, err => {
            window.console.log('error');
            window.console.log(err);
            if (err.response) {
                commit('UPDATE_RESPONSE', err.response);
            }
        }).catch(err => {
            window.console.log(err);
        });
    }
};

export default actions;
