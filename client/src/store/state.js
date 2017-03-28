const apiInit = {
    url: null,
    name: '',
    group: '',
    desc: null,
    options: {
        method: 'get',
        params: [
            {
                key: null,
                type: 'String',
                required: true
            }
        ]
    }
};
const state = {
    groups: [],
    collect: false,
    validate: false,
    api: apiInit
};

export default state;
