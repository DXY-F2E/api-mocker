
function initData() {
    return {
        url: null,
        prodUrl: null,
        name: '',
        group: '',
        desc: null,
        options: {
            response: [{
                status: 200,
                params: [{
                    key: null,
                    value: '',
                    type: 'string',
                    required: true,
                    comment: ''
                }]
            }],
            method: 'get',
            delay: 0,
            params: {
                query: [],
                body: [],
                path: []
            }
        }
    };
}
export default initData;

