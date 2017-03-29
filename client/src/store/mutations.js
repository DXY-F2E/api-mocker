const mutations = {
    INIT_GROUPS(state, groups) {
        state.groups = groups;
    },
    UPDATE_API_PARAMS(state, params) {
        state.api.options.params = JSON.parse(JSON.stringify(params));
    },
    UPDATE_API_METHOD(state, method) {
        state.api.options.method = method;
    },
    UPDATE_API_DSL(state, dsl) {
        try {
            state.api.dsl = JSON.parse(dsl);
        } catch (err) {
            return false;
        }
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
    }
};

export default mutations;
