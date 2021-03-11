import Api from '@/model/api'
import { buildReqParams, buildResponse } from './swaggerUtilSet'
/**
 * 从esay mock接口中构建apis
 * @param  {html}  String 页面接口返回的页面字符串
 * @param  {group} Obejct 群组信息
 * @param  {param} Obejct 用户输入信息
 * @return {[type]} Array 构建完成之后组件弹窗
 */
function buildApisFromEasyMockHtml (html, group, param) {
  let jsonString = html.split('window.__INITIAL_STATE__=')[1].split('</scrip')[0]
  let {devUrl, prodUrl} = param
  let json = {}

  try {
    json = JSON.parse(jsonString) || {}
    let { mock } = json
    let { list = [] } = mock

    let easyMockApis = []
    easyMockApis = list.map((item) => {
      let {url, method, description, parameters, response_model} = item
      const requestList = JSON.parse(parameters) || []
      const responseList = JSON.parse(response_model) || []

      const api = Api()

      api.url = url
      api.devUrl = `${devUrl}${url}`
      api.prodUrl = `${prodUrl}${url}`
      api.name = description
      api.desc = description
      api.group = group._id
      api.options.method = method
      api.options.params = buildReqParams(api.options.params, requestList, {})
      api.options.response = buildResponse(responseList, {})

      return api
    })

    return easyMockApis
  } catch (e) {
    console.log(e)
  }
}

export default buildApisFromEasyMockHtml
