function initData() {
    return {
        url: null,
        name: '',
        group: '',
        desc: null,
        options: {
            method: 'get',
            delay: 0,
            params: [
                {
                    key: null,
                    type: 'String',
                    required: true
                }
            ]
        }
    };
}
export default initData;

