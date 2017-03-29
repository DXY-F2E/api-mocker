import axios from 'axios';
import apiInit from './apiInitData';
const ROOT = 'http://127.0.0.1:7001/server';
const isEmpty = function(val) {
    return val === undefined || val.trim() === '' || val === null;
};
const actions = {
    getGroups({ commit }) {
        const url = `${ROOT}/group`;
        axios.get(url).then(res => {
            commit('INIT_GROUPS', res.data.resources);
        }, res => {
            window.console.log(res);
        });
    },
    getApiList({ commit }) {
        axios.get(`${ROOT}/api`).then(res => {
            commit('INIT_API_LIST', res.data.resources);
        }, res => {
            window.console.log(res);
        });
    },
    getApi({ commit }, params) {
        // axios.get(`${ROOT}/api/${params.groupId}/${params.apiId}`).then(res => {
        //     commit('UPDATE_API', res.data.resources);
        // }, res => {
        //     window.console.log(res);
        // });
        return axios.get(`${ROOT}/api/${params.groupId}/${params.apiId}`);
    },
    updateApi({ state }) {
        const api = state.api;
        return axios.put(`${ROOT}/api/${api.group}/${api._id}`, api);
    },
    saveApi({ dispatch, state }) {
        if (state.api._id) {
            return dispatch('updateApi');
        } else {
            return dispatch('createApi');
        }
    },
    createApi({ state }) {
        return axios.post(`${ROOT}/api/${state.api.group}`, state.api);
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
