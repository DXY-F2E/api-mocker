import Schema from './apiInitSchema';
function initData() {
    return {
        url: null,
        prodUrl: null,
        name: '',
        group: '',
        desc: null,
        options: {
            response: [new Schema()],
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

