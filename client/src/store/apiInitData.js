import Schema from './apiInitSchema';
function initData() {
    return {
        prodUrl: null,
        name: '',
        group: '',
        desc: null,
        options: {
            response: [new Schema()],
            responseIndex: 0,
            headers: {
                example: null,
                params: []
            },
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

