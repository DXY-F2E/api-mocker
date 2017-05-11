
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
                schema: []
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

