import { buildExampleFormSchema } from '../../dsl-core/index.js';
import config from '../config';
function getDomain() {
    const protocol = window.location.href.indexOf('https') === 0 ? 'https://' : 'http://';
    return protocol + (process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax);
    // if (process.env.NODE_ENV === 'development') {
    //     return `http://${config.dev.ajax}`;
    // } else {
    //     return `https://${config.build.ajax}`;
    // }
}
function isEmpty(val) {
    return !val || val.trim() === '';
}
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
function buildParams(json) {
    const schema = [];
    for (const key in json) {
        const type = typeof json[key];
        const param = {
            key,
            type,
            required: true,
            comment: null
        };
        if (type === 'object' && json[key] instanceof Array) {
            param.type = 'array';
            param.items = {
                type: typeof json[key][0]
            };
            if (param.items.type === 'object') {
                param.items.params = buildParams(json[key][0]);
            }
        } else if (type === 'object') {
            param.params = buildParams(json[key]);
        } else {
            param.example = json[key];
        }
        schema.push(param);
    }
    return schema;
}
function buildSchemaFormExample(json, statusText = 'status1', status = 200) {
    const schema = {
        status,
        statusText,
        example: json,
        params: []
    };
    schema.params = buildParams(json);
    return schema;
}
function buildApiResponse(api) {
    if (api.options.response) {
        return api;
    }
    api.options.response = [buildSchemaFormExample(api.dsl)];
    return api;
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
    buildExampleFormSchema,
    buildSchemaFormExample,
    buildApiResponse,
    validateApi,
    isEmpty,
    clone,
    getDomain
};
