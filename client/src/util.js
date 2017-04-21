function isEmpty(val) {
    return !val || val.trim() === '';
}

function validateApi(state) {
    const regex = new RegExp(/^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&~+#])?$/);
    const api = state.api;
    if (isEmpty(api.name)) {
        return {
            status: false,
            msg: '接口名不能为空'
        };
    } else if (isEmpty(api.group)) {
        return {
            status: false,
            msg: '接口分组不能为空'
        };
    } else if (!isEmpty(api.prodUrl) && !regex.test(api.prodUrl)) {
        return {
            status: false,
            msg: '线上API路径错误'
        };
    } else if (!state.isDslRight) {
        return {
            status: false,
            msg: '请正确填写Response'
        };
    } else {
        return {
            status: true
        };
    }
}

export {
    validateApi,
    isEmpty
};
