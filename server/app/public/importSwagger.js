const Api = require('./api')
const { buildReqParams, buildResponse } = require('./swaggerUtilSet')
/**
 * 从swagger json配置文件中构建apis
 * @param  {json}   json   json对象
 * @param  {group}  Obejct 群组信息
 * @param  {param}  Obejct 用户输入信息
 * @return {[type]} Obejct 构建完成之后组件弹窗
 */
function buildApisFormSwagger (json, group, param) {
  let {devUrl = '', prodUrl = ''} = param
  // swagger 导出 JSON 格式
  /*
   * swagger: 版本
   * info: {
   *    version: 1.0 接口版本
   *    title: '' 接口名字
   *    license: '' 许可证
   * }
   * host: ''
   * basePath: ''
   * tags: {  }
   * paths: {
   *    "路径": {
   *      'get': {
   *      }
   *    }
   * }
   */
  let {
    info = {},
    paths = {}
  } = json || {}
  let _definitions = json.definitions || {}

  let { title = '' } = info

  const swaggerApis = []

  for (let [key, value] of Object.entries(paths)) {
    try {
      for (let method in value) {
        const methodValue = value[method]
        const { summary, tags = [] } = methodValue || {}
        const api = Api()

        api.url = key
        api.devUrl = `${devUrl}${key}`
        api.prodUrl = `${prodUrl}${key}`
        api.name = `${title ? `${title}-` : ''}${tags.join(',') ? `${tags.join(',')}-` : ''}${summary}`
        api.desc = summary
        api.group = group._id
        api.options.method = method
        api.options.params = buildReqParams(api.options.params, methodValue.parameters || [], _definitions)
        api.options.response = buildResponse(methodValue.responses, _definitions)

        swaggerApis.push(api)
      }
    } catch (e) {
      console.log(`${key} API 有误 无法解析`)
      console.warn(e)
    }
  }

  return swaggerApis
}

module.exports = buildApisFormSwagger
