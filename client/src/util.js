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
            status: false,
            msg: '接口名不能为空'
        };
    } else if (isEmpty(api.group)) {
        rs = {
            status: false,
            msg: '接口分组不能为空'
        };
    } else if (!isEmpty(api.prodUrl) && !regex.test(api.prodUrl)) {
        rs = {
            status: false,
            msg: '线上API路径错误'
        };
    } else if (!state.isDslRight) {
        rs = {
            status: false,
            msg: '请正确填写Response'
        };
    } else {
        rs = {
            status: true
        };
    }
    return new Promise((resolve, reject) => {
        if (rs.status) {
            resolve(rs);
        } else {
            reject(rs);
        }
    });
}

export {
    validateApi,
    isEmpty,
    clone
};
