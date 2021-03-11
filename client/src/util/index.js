import config from '../../config'
export { default as buildExampleFromSchema } from 'mocker-dsl-core/lib/buildExampleFromSchema'
export { default as buildSchemaFromExample } from './buildSchemaFromExample'
export { default as buildApiResponse } from './buildApiResponse'
export { default as validateApi } from './validateApi'
export { default as catchError } from './catchError'
export { default as getUrlAllParams } from './getUrlAllParams'

export function getDomain () {
  const protocol = window.location.href.indexOf('https') === 0 ? 'https://' : 'http://'
  return process.env.NODE_ENV === 'development' ? protocol + config.dev.serverRoot : config.build.serverRoot
}

export function buildRestUrl (baseUrl, params) {
  for (const key in params) {
    const placeholder = `:${key}`
    if (baseUrl.indexOf(placeholder) === -1) {
      baseUrl += `/${params[key]}`
    } else {
      baseUrl = baseUrl.replace(placeholder, params[key])
    }
  }
  return baseUrl
}

export function debounce (fun, interval) {
  let timer = -1
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, interval)
  }
}

export function throttle (fn, gapTime) {
  let lastTime = null

  return function () {
    let now = +new Date()
    if (now - lastTime > gapTime || !lastTime) {
      fn()
      lastTime = now
    }
  }
}

export function urlJoin (...args) {
  if (args.length > 0) {
    const strs = args.map((arg, index) => {
      let str = arg
      // 去掉头部/
      if (str && index !== 0 && str.startsWith('/')) str = str.substr(1, str.length - 1)
      // 去掉尾部/
      if (str && index !== args.length - 1 && str.endsWith('/')) str = str.substr(0, str.length - 1)
      return str
    })
    return strs.join('/')
  }
  return ''
}
