import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const state = {
    groups: [],
    api: {},
    createDialog: false
};
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    strict: debug
});
