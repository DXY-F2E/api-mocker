import Api from '@/model/api'

function buildReqParams (params, parameterList, methodType) {
  methodType = Number(methodType)
  const newParams = buildParams(parameterList)
  if (methodType === 1) {
    params.query = newParams
  } else {
    params.body = newParams
  }
  return params
}
function buildResponse (parameterList) {
  return [{
    status: 200,
    statusText: 'status1',
    example: null,
    params: buildParams(parameterList)
  }]
}
function buildParams (parameterList) {
  return parameterList.map(p => {
    const param = {
      key: p.identifier,
      type: p.dataType,
      required: true,
      comment: p.name
    }
    if (p.remark.indexOf('@mock') === 0) {
      param.example = p.remark.replace('@mock=', '')
    } else {
      param.comment += ` ${p.remark}`
    }
    if (param.type === 'object') {
      param.params = buildParams(p.parameterList)
    }
    if (param.type.indexOf('array') >= 0) {
      param.items = {
        type: param.type.replace('array<', '').replace('>', '')
      }
      param.params = buildParams(p.parameterList)
      param.type = 'array'
    }
    return param
  })
}

function buildApisFormRap (json, group, param) {
  let methods = ['get', 'post', 'put', 'delete']
  let {devUrl, prodUrl} = param
  let moduleList = []
  if (json.modelJSON) {
    moduleList = JSON.parse(json.modelJSON).moduleList
  } else if (json.projectData) {
    moduleList = json.projectData.moduleList
  } else {
    // $message.error('json格式错误')
    return
  }
  const apis = []
  moduleList.forEach(module => {
    module.pageList.forEach(page => {
      page.actionList.forEach(action => {
        window.console.log(action)
        let {requestUrl} = action
        const apiName = `${module.name}-${page.name}-${action.name}`
        const api = Api()
        api.name = apiName
        api.desc = action.description

        api.devUrl = `${devUrl}${requestUrl}`
        api.prodUrl = `${prodUrl}${requestUrl}`

        api.group = group._id
        const requestType = Number(action.requestType)
        api.options.method = methods[requestType - 1]
        api.options.params = buildReqParams(api.options.params, action.requestParameterList, requestType)
        api.options.response = buildResponse(action.responseParameterList)
        apis.push(api)
      })
    })
  })

  return apis
}

export default buildApisFormRap
