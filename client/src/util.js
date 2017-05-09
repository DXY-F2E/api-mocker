function isEmpty(val) {
    return !val || val.trim() === '';
}
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}

function validateApi(state) {
    const regex = new RegExp(/^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&~+#])?$/);
    const api = state.api;
    let rs = {};
    if (isEmpty(api.name)) {
        rs = {
            success: false,
            msg: '接口名不能为空'
        };
    } else if (isEmpty(api.group)) {
        rs = {
            success: false,
            msg: '接口分组不能为空'
        };
    } else if (!isEmpty(api.prodUrl) && !regex.test(api.prodUrl)) {
        rs = {
            success: false,
            msg: '线上API路径错误'
        };
    } else if (!state.dslStatus.success) {
        rs = state.dslStatus;
    } else {
        rs = {
            success: true
        };
    }
    // window.console.log(rs);
    return new Promise((resolve, reject) => {
        if (rs.success) {
            resolve(rs);
        } else {
            // window.console.log(rs);
            reject(rs);
        }
    });
}

export {
    validateApi,
    isEmpty,
    clone
};
