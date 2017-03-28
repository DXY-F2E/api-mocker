import axios from 'axios';

const actions = {
    getGroups({ commit }) {
        // const ROOT = 'http://127.0.0.1:7001';
        const url = 'http://127.0.0.1:7001/server/group';
        axios.get(url).then(response => {
            // success callback
            commit('INIT_GROUPS', response.data.resources);
        }, response => {
            window.console.log(response);
            // error callback
        });
    },
    saveApi(context) {
        window.console.log(context.state.api);
        return true;
    },
    createApi(context, cb) {
        window.console.log(context.state.api);
        const api = context.state.api;
        const url = `http://127.0.0.1:7001/server/api/${api.group}`;
        axios.post(url, api).then(response => {
            // success callback
            window.console.log('success');
            window.console.log(response.data);
            context.commit('UPDATE_API', response.data);
            cb.success();
        }).catch(error => {
            cb.fail(error.response.data.message);
        });
        return true;
    }
};

export default actions;
