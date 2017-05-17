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
            responseIndex: 0,
            method: 'get',
            delay: 0,
            examples: {
                query: null,
                body: null,
                path: null
            },
            params: {
                query: [],
                body: [],
                path: []
            }
        }
    };
}
export default initData;

