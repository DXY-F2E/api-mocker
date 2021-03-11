import Api from '@/model/api'
import { buildSchemaFromExample } from '@/util'

function extractParamsAndExample (list) {
  let example = {}
  let params = []

  list.forEach((item) => {
    let {name, value, comment} = item
    example[name] = value
    params.push({
      key: name,
      example: value,
      type: typeof value,
      comment
    })
  })
  return {params, example}
}

function buildReqParams (request, status, statusText) {
  let {headers = [], queryString = [], postData} = request
  let examples = {path: null, body: null, query: null}
  let params = {path: [], body: [], query: []}

  let optionHeaders = extractParamsAndExample(headers)

  if (queryString.length) {
    let queryResult = extractParamsAndExample(queryString)
    examples.query = queryResult.example
    params.query = queryResult.params
  }

  if (postData) {
    let {text = '', encoding} = postData
    if (text) {
      if (encoding === 'base64') {
        text = window.atob(text)
      }
      let example = JSON.parse(text)
      let bodyResult = buildSchemaFromExample(example, {}, statusText, status)
      example.body = bodyResult.example
      params.body = bodyResult.params
    }
  }
  return {examples, params, optionHeaders}
}

function buildResponse (response, status, statusText) {
  let {content} = response
  let {text, encoding} = content
  let example = {}
  if (encoding === 'base64') {
    text = window.atob(text)
  }
  example = JSON.parse(text)
  return [buildSchemaFromExample(example, {}, statusText, status)]
}

function buildApisFormHar (json, group, param) {
  let { log } = json
  let { entries = [] } = log
  let {devUrl, prodUrl} = param

  let result = entries.map((entry, index) => {
    const api = Api()

    let {request, response} = entry
    let {method, url} = request
    let {pathname} = new URL(url)
    let {status, statusText} = response

    api.name = `Api-form-har_${index}`
    api.url = pathname
    api.devUrl = `${devUrl}${pathname}`
    api.prodUrl = `${prodUrl}${pathname}`
    api.group = group._id
    api.modifiedTime = api.createTime = new Date().getTime()

    api.options.method = method
    let {examples, params, optionHeaders} = buildReqParams(request, status, statusText)
    api.options.headers = optionHeaders
    api.options.params = params
    api.options.examples = examples
    api.options.response = buildResponse(response, status, statusText)

    return api
  })

  return result
}

export default buildApisFormHar
