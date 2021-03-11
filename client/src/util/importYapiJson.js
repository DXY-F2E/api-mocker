import Api from '@/model/api'
import { handleSwaggerSchema, buildParams } from './swaggerUtilSet'

function extractParamsAndExample (list) {
  let example = {}
  let params = []

  list.forEach((item) => {
    let {name, required = 0, desc, value} = item
    example[name] = item.example || value || ''
    params.push({
      key: name,
      example: example[name],
      type: typeof example[name],
      required: !!Number(required),
      comment: desc
    })
  })
  return {params, example}
}

function buildReqParams (entry) {
  let examples = {path: null, body: null, query: null}
  let params = {path: [], body: [], query: []}

  let optionHeaders = extractParamsAndExample(entry.req_headers || [])

  if (entry.req_query && entry.req_query.length) {
    let queryResult = extractParamsAndExample(entry.req_query)
    params.query = queryResult.params
  }

  if (entry.req_body_type === 'form' && Array.isArray(entry.req_body_form) && entry.req_body_form.length) {
    let bodyResult = extractParamsAndExample(entry.req_body_form)
    params.body = bodyResult.params
  }

  if (entry.req_body_type === 'json' && entry.req_body_other) {
    let reqBody = JSON.parse(entry.req_body_other || '{}')
    let bodyResult = handleSwaggerSchema(reqBody, 0, {})
    params.body = buildParams(bodyResult.params)
  }

  return {examples, params, optionHeaders}
}

function buildYapiResponse (entry) {
  let responseResult = {status: 200, statusText: 'ok', example: null, params: []}
  let params = []
  try {
    let resBody = JSON.parse(entry.res_body)
    delete resBody.$schema
    let handledSchema = handleSwaggerSchema(resBody, 0, {})
    const getedParams = handledSchema.params || (handledSchema.result && handledSchema.result.params) || []
    if (getedParams.length) {
      params = buildParams(getedParams)
    }
    responseResult.params = params
  } catch (e) {
    responseResult.status = 405
    responseResult.statusText = entry.res_body
  }
  return [responseResult]
}

function buildApisFormYapiJson (json, group, param) {
  let apis = []

  json.forEach((category) => {
    let { list } = category
    let {devUrl, prodUrl} = param
    let result = list.map((entry) => {
      const api = Api()
      let { title, path, method } = entry

      api.name = title
      api.url = path
      api.devUrl = `${devUrl}${path}`
      api.prodUrl = `${prodUrl}${path}`
      api.group = group._id
      api.modifiedTime = entry.up_time
      api.createTime = entry.add_time
      api.options.method = method

      let {examples, params, optionHeaders} = buildReqParams(entry)
      api.options.headers = optionHeaders
      api.options.params = params
      api.options.examples = examples
      api.options.response = buildYapiResponse(entry)

      return api
    })
    apis = apis.concat(result)
  })

  return apis
}

export default buildApisFormYapiJson
