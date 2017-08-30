import { buildExampleFromSchema } from '../../../dsl-core/index.js'
import buildSchemaFromExample from './buildSchemaFromExample'

import config from '../../config'
function getDomain () {
  const protocol = window.location.href.indexOf('https') === 0 ? 'https://' : 'http://'
  return protocol + (process.env.NODE_ENV === 'development' ? config.dev.ajax : config.build.ajax)
}
function catchError (err) {
  if (err.response && err.response.status === 401) {
    window.location.href = '#/login'
  }
    // console.log(err.response);
    // throw err;
  return Promise.reject({
    response: err.response,
    statusCode: err.response.status,
    statusText: err.response.statusText,
    msg: err.response.data.message
  })
}
function isEmpty (val) {
  return !val || val.trim() === ''
}
function clone (val) {
  return JSON.parse(JSON.stringify(val))
}
function buildApiResponse (api) {
  if (api.options.response) {
    return api
  }
  api.options.response = [buildSchemaFromExample(api.dsl)]
  return api
}
function validateApi (state) {
    // const regex = new RegExp(/^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&~+#])?$/);
  const api = state.api
  let rs = {}
  if (isEmpty(api.name)) {
    rs = {
      success: false,
      msg: '接口名不能为空'
    }
  } else if (isEmpty(api.group)) {
    rs = {
      success: false,
      msg: '接口分组不能为空'
    }
  } else if (!state.dslStatus.success) {
    rs = state.dslStatus
  } else {
    rs = {
      success: true
    }
  }
  return new Promise((resolve, reject) => {
    if (rs.success) {
      resolve(rs)
    } else {
      reject(rs)
    }
  })
}

function buildRestUrl (baseUrl, params) {
  for (const key in params) {
    const placeholder = `:${key}`
    if (baseUrl.indexOf(placeholder) === -1) {
      baseUrl += `/${params[key]}`
    } else {
      baseUrl.replace(placeholder, params[key])
    }
  }
  return baseUrl
}

function debounce (fun, interval) {
  let timer = -1
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fun.apply(this, args), interval)
  }
}
export {
    buildExampleFromSchema,
    buildSchemaFromExample,
    buildApiResponse,
    validateApi,
    isEmpty,
    clone,
    getDomain,
    catchError,
    debounce,
    buildRestUrl
}
