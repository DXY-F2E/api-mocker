function initData() {
    return {
        url: null,
        prodUrl: null,
        name: '',
        group: '',
        desc: null,
        options: {
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

