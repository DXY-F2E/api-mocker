function findParam (params, key) {
  if (!params || !params.length) {
    return null
  }
  return params.find(p => p.key === key)
}
function buildParams (json, params) {
  const schema = []
  for (const key in json) {
    const type = typeof json[key]
    const oldParam = findParam(params, key)
    const param = oldParam || {
      key,
      required: true,
      comment: null
    }
    param.type = type
    if (type === 'object' && json[key] instanceof Array) {
      param.type = 'array'
      param.items = {
        type: typeof json[key][0]
      }
      if (param.items.type === 'object') {
        param.items.params = buildParams(json[key][0], oldParam && oldParam.items && oldParam.items.params)
      } else {
        param.example = json[key]
      }
    } else if (type === 'object') {
      param.params = buildParams(json[key], oldParam && oldParam.params)
    } else {
      param.example = json[key]
    }
    schema.push(param)
  }
  return schema
}
export default (json, params = null, statusText = 'status1', status = 200) => {
  const schema = {
    status,
    statusText,
    example: json,
    params: []
  }
  schema.params = buildParams(json, params)
  return schema
}
