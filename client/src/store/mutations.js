const mutations = {
    INIT_GROUPS(state, groups) {
        state.groups = groups;
    },
    CREATE_GROUP_SUCCESS(state, data) {
        state.groups = state.groups.concat(data);
    },
    GET_GROUP_API(state, data) {
        state.apiList = data;
    },
    INIT_API(state, api) {
        state.api = api;
    },
    INIT_API_LIST(state, apiList) {
        state.apiList = apiList;
    },
    UPDATE_API_PARAMS(state, params) {
        state.api.options.params = params;
    },
    UPDATE_API_METHOD(state, method) {
        state.api.options.method = method;
    },
    UPDATE_API_DSL(state, dsl) {
        state.api.dsl = dsl;
    },
    UPDATE_API_NAME(state, name) {
        state.api.name = name;
    },
    UPDATE_API_GROUP(state, group) {
        state.api.group = group;
    },
    UPDATE_API_DESC(state, desc) {
        state.api.desc = desc;
    },
    UPDATE_API(state, data) {
        state.api = data;
    },
    INIT_EDITOR(state, editor) {
        state.editor = editor;
    }
};
export default mutations;
