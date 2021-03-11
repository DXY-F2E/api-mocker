function buildReqParams (params, parameterList, _definitions = {}) {
  const queryParams = parameterList.filter(item => item.in === 'query')
  const pathParams = parameterList.filter(item => item.in === 'path')
  const bodyParams = parameterList.filter(item => item.in === 'body')
  const formDataParams = parameterList.filter(item => item.in === 'formData')
  const headerParams = parameterList.filter(item => item.in === 'header')

  const buildedQueryParams = buildParams(queryParams)
  const buildedPathParams = buildParams(pathParams)
  const buildedFormDataParams = buildParams(formDataParams)

  const test = extractBodyParam(bodyParams, _definitions)
  const buildedBodyParams = buildParams(test).concat(buildedFormDataParams)
  const buildedHeaderParams = buildParams(headerParams)

  params.query = buildedQueryParams
  params.path = buildedPathParams
  params.body = buildedBodyParams
  params.header = buildedHeaderParams
  return params
}

/**
   * 该函数判断传入的对象之中是否包含 $ref 的属性
   * @param  {obj}  obj 被判断的对象
   * @return {Boolean}     含有 $ref 属性 返回true, 否则返回false
   */
function isHas$refProperty (obj) {
  return obj.hasOwnProperty('$ref')
}

function extractBodyParam (bodyParams, _definitions) {
  let newBodyParams = []
  bodyParams.forEach(item => {
    let {params = []} = handleSwaggerSchema(item.schema, 0, _definitions)
    newBodyParams = newBodyParams.concat(params)
  })
  return newBodyParams
}

/**
   * 处理swagger中的含有json引用的情况
   * @param  {object} schema      可能包含变量的对象
   * @param  {object} definitions 该json中定义的所有变量 **弃用** => 现在存储在了组件内部的全局变量
   * @return {object}             被变量替换完成之后的json
   */
function handleSwaggerSchema (schema, _execCount = 0, _definitions) {
  let refObj = {}
  let params = []
  if (_execCount >= 50) {
    // 如果调用函数次数过多, 说明这个API是一个循环引用的API,
    // 为了防止浏览器栈溢出, 抛出错误
    throw new RangeError('递归执行过多, 终止')
  }

  if (isHas$refProperty(schema)) {
    let $ref = schema['$ref'] || ''
    let refList = $ref.match(/.*\/(.*?)$/) || []
    let ref = refList[1] || ''
    refObj = _definitions[ref] // refObj refreanced by the ref

    if (!refObj) {
      return {}
    }
  } else {
    refObj = schema
  }

  let { properties, required, ...refObjNoProperties } = refObj
  // 如果返回一个非json数据, 目前api-mocker无法支持 在外层包一层result
  if (!isHas$refProperty(refObj) && refObj.type === 'array') {
    properties = {result: refObj}
  }
  params = swaggerObjectToArray(properties)

  params = params.map(item => {
    const { type, $ref } = item
    if (Array.isArray(required)) {
      item.required = item.name ? required.indexOf(item.name) > -1 : false
    }

    if ($ref || type === 'object') { // 如果有$ref)
      return Object.assign({}, { ...item }, handleSwaggerSchema(item, _execCount + 1, _definitions))
    }

    if (type === 'array') { // 类型是数组
      return Object.assign({}, { ...item }, {items: handleSwaggerSchema(item.items, _execCount + 1, _definitions)})
    }
    return {...item, type: getSwaggerType(item.type)}
  })

  return { ...refObjNoProperties, params }
}
/**
   * 将 swagger 中的对象转换成 [{ name: key, ...value }] 形式
   * @param  {obj} obj 对象
   * @return {array}     生成的数组
   *
   * @example
   *
   * {
   *   'foo': { type: 'integer', format: 'int32' },
   *   'bar': { type: 'integer', 'format': 'int32' }
   * }
   *                   ||
   *                   ||
   *                   ||
   *                   \/
   * [{ name: 'foo', type: 'integer', 'format': 'int32' }, { name: 'bar', type: 'integer', 'format': 'int32' }]
   */
function swaggerObjectToArray (obj = {}) {
  const array = []

  for (let [key, value] of Object.entries(obj)) {
    array.push(Object.assign({}, {
      name: key
    }, {
      ...value
    }))
  }

  return array
}

/**
   * 处理 swagger 中的数据类型和 api-mocker 数据类型的映射
   * @param  {string} type swagger 数据类型
   * @return {string}      api-mocker 数据类型
   */
function getSwaggerType (param) {
  let type = param.toLowerCase()
  switch (type) {
    case 'integer': {
      return 'number'
    }
    case 'int': {
      return 'number'
    }
    default: {
      return type
    }
  }
}

/**
   * 构建响应或请求的参数列表
   * @param  {array} parameterList 参数数组
   * @return {array}               构建出来的参数数组
   */
function buildParams (parameterList = []) {
  return parameterList.map(item => {
    let enumList = item.enum || []
    let comment = `${item.description || ''}${enumList.length ? ' enum: ' + enumList.join(',') : ''}`
    var param = {
      key: item.name,
      type: getSwaggerType(item.type),
      required: !!item.required,
      example: item.default || item.example,
      comment
    }

    if (param.type === 'object' && item.params) {
      param.params = buildParams(item.params)
    } else {
      param.params = []
    }

    if (param.type && param.type.indexOf('array') >= 0) {
      param.items = {
        type: item.items && getSwaggerType(item.items.type),
        params: item.items && item.items.type === 'object' && buildParams(item.items.params)
      }
      param.type = 'array'
    }

    return param
  })
}

/**
   * 构建所有响应的响应体, 循环该接口应该有的响应状态数组
   * @param  {Array} responseList 响应数组
   * @return {[type]}             构建出来的响应体数组
   */
function buildResponse (responseList, _definitions = {}) {
  const statusArray = []

  for (let [statusCode, content] of Object.entries(responseList)) {
    let params = []
    if (content.schema) { // 如果该响应有响应体
      const handledSchema = handleSwaggerSchema(content.schema, 0, _definitions)
      const getedParams = handledSchema.params || (handledSchema.result && handledSchema.result.params)

      if (getedParams) {
        params = buildParams(getedParams)
      } else {
        params = []
      }
    }
    statusArray.push({
      status: statusCode,
      statusText: content.description,
      example: null,
      params: params
    })
  }
  return statusArray
}

module.exports = { buildReqParams, buildResponse, handleSwaggerSchema, buildParams }
