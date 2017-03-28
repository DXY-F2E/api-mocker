import axios from 'axios';

const actions = {
    GET_GROUPS({ commit }) {
        // const ROOT = 'http://127.0.0.1:7001';
        const url = 'http://127.0.0.1:7001/server/group';
        axios.get(url).then(response => {
            // success callback
            commit('INIT_GROUPS', response.data.resources);
        }, response => {
            window.console.log(response);
            // error callback
        });
    }
};

export default actions;
