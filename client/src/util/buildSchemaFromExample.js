import Param from '@/model/param'
import R from 'ramda'
import * as deepmerge from 'deepmerge'

function findParam (params, key) {
  if (!params || !params.length) {
    return null
  }
  return params.find(p => p.key === key)
}
function buildParams (json, oldParams) {
  const params = []
  for (const key in json) {
    const jsonValue = json[key]
    const type = typeof jsonValue
    // null, {}, [] 都属于空，属性则为选填
    // const required = !(R.isEmpty(jsonValue) || jsonValue === null)
    const oldParam = findParam(oldParams, key)
    const param = new Param({
      ...(oldParam || {}),
      key,
      type,
      required: false
    })
    if (type === 'object' && jsonValue instanceof Array) {
      param.type = 'array'
      param.items = { type: typeof jsonValue[0] }
      if (param.items.type === 'object') {
        param.items.params = buildArrayParams(jsonValue, oldParam && oldParam.items && oldParam.items.params)
      } else {
        param.example = jsonValue
      }
    } else if (type === 'object') {
      param.params = buildParams(jsonValue, oldParam && oldParam.params)
    } else {
      param.example = jsonValue
    }
    params.push(param)
  }
  // 保证在页面上呈现一个可填项
  if (params.length === 0) {
    params.push(new Param())
  }
  return params
}

function buildArrayParams (data = [], params) {
  let allObject = data.filter(item => !R.isEmpty(item)).reduce((result, currentObject) => deepmerge(result, currentObject))
  return buildParams(allObject, params)
}

export default (json, oldParams = null, statusText = 'status1', status = 200) => {
  const schema = {
    status,
    statusText,
    example: json,
    params: []
  }
  schema.params = buildParams(json, oldParams)
  return schema
}
