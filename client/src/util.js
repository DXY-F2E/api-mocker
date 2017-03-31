function isEmpty(val) {
    return !val || val.trim() === '';
}

function validateApi(state) {
    if (isEmpty(state.api.name)) {
        return {
            status: false,
            msg: '接口名不能为空'
        };
    } else if (isEmpty(state.api.group)) {
        return {
            status: false,
            msg: '接口分组不能为空'
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
