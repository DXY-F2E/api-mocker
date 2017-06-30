import { buildExampleFormSchema } from '../../dsl-core/index.js';
import config from '../config';
function getDomain() {
    const protocol = window.location.href.indexOf('https') === 0 ? 'https://' : 'http://';
    return protocol + (process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax);
}
function catchError(err) {
    if (err.response && err.response.status === 401) {
        window.location.href = '#/login';
    }
    // console.log(err.response);
    // throw err;
    return Promise.reject({
        response: err.response,
        statusCode: err.response.status,
        statusText: err.response.statusText,
        msg: err.response.data.message
    });
}
function isEmpty(val) {
    return !val || val.trim() === '';
}
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
function findParam(params, key) {
    if (!params || !params.length) {
        return null;
    }
    return params.find(p => p.key === key);
}
function buildParams(json, params) {
    const schema = [];
    for (const key in json) {
        const type = typeof json[key];
        const oldParam = findParam(params, key);
        const param = oldParam || {
            key,
            required: true,
            comment: null
        };
        param.type = type;
        if (type === 'object' && json[key] instanceof Array) {
            param.type = 'array';
            param.items = {
                type: typeof json[key][0]
            };
            if (param.items.type === 'object') {
                param.items.params = buildParams(json[key][0], oldParam && oldParam.items && oldParam.items.params);
            } else {
                param.example = json[key];
            }
        } else if (type === 'object') {
            param.params = buildParams(json[key], oldParam && oldParam.params);
        } else {
            param.example = json[key];
        }
        schema.push(param);
    }
    return schema;
}
function buildSchemaFormExample(json, params = null, statusText = 'status1', status = 200) {
    const schema = {
        status,
        statusText,
        example: json,
        params: []
    };
    schema.params = buildParams(json, params);
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
    // const regex = new RegExp(/^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&~+#])?$/);
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

function debounce(fun, interval) {
    let timer = -1;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fun.apply(this, args), interval);
    };
}
export {
    buildExampleFormSchema,
    buildSchemaFormExample,
    buildApiResponse,
    validateApi,
    isEmpty,
    clone,
    getDomain,
    catchError,
    debounce
};
