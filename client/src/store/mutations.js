const mutations = {
    INIT_GROUPS(state, groups) {
        state.groups = groups;
    },
    SHOW_CREATE_DIALOG(state) {
        state.createDialog = true;
    }
};

export default mutations;
