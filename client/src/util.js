function isEmpty(val) {
    return !val || val.trim() === '';
}

function validateApi(api) {
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
