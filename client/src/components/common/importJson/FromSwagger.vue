<template>
  <div>
    <el-upload
      action=""
      :auto-upload="false"
      :show-file-list="false"
      accept="application/json"
      ref="importSwaggerJson"
      :on-change="importJsonFromSwagger"
    >
      <i class="el-icon-upload2"></i>导入Swagger Json
    </el-upload>
    <success
      v-if="importSuccess"
      :visible="importSuccess"
      :apis-data="apisData"
      @visibleChange="visibleChange"
    >

    </success>
  </div>
</template>

<script>
import Api from '@/model/api'
import Success from './Success'

let _definitions = {} // 组件全局 definations
/**
 * 处理 swagger 中的数据类型和 api-mocker 数据类型的映射
 * @param  {string} type swagger 数据类型
 * @return {string}      api-mocker 数据类型
 */
function getSwaggerType (type) {
  switch (type) {
    case 'integer': {
      return 'number'
    }
    default: {
      return type
    }
  }
}
/**
 * 该函数判断传入的对象之中是否包含 $ref 的属性
 * @param  {obj}  obj 被判断的对象
 * @return {Boolean}     含有 $ref 属性 返回true, 否则返回false
 */
function isHas$refProperty (obj) {
  return obj.hasOwnProperty('$ref')
}
/**
 * 处理swagger中的含有json引用的情况
 * @param  {object} schema      可能包含变量的对象
 * @param  {object} definitions 该json中定义的所有变量 **弃用** => 现在存储在了组件内部的全局变量
 * @return {object}             被变量替换完成之后的json
 */
function handleSwaggerSchema (schema, _execCount = 0) {
  if (_execCount >= 50) {
    // 如果调用函数次数过多, 说明这个API是一个循环引用的API,
    // 为了防止浏览器栈溢出, 抛出错误
    throw new RangeError('递归执行过多, 终止')
  }

  if (!isHas$refProperty(schema) && _execCount === 0) {
    if (schema.type === 'array') { // 如果返回一个非json数据, 目前api-mocker无法支持 在外层包一层result
      return {
        result: handleSwaggerSchema(schema.items, _execCount + 1)
      }
    }

    if (schema.type !== 'object') { // 如果只返回一个非json数据, 目前api-mocker无法支持 在外层包一层result
      return swaggerObjectToArray({
        result: {
          type: getSwaggerType(schema.type)
        }
      })
    }

    return Object.assign({
      params: []
    }, schema)
  } else {
    let ref = schema['$ref'].match(/.*\/(.*?)$/)[1] // key
    let refObj = _definitions[ref] // refObj refreanced by the ref

    if (!refObj) {
      return {}
    }

    let { properties, ...refObjNoProperties } = refObj
    let params = swaggerObjectToArray(properties)

    params = params.map(item => {
      const { type } = item

      if (type === 'array') { // 类型是数组
        if (isHas$refProperty(item.items)) {
          item.items = Object.assign({}, {
            name: item.name,
            description: item.description
          }, handleSwaggerSchema(item.items, _execCount + 1))
          return item
        }

        return item
      }

      if (!isHas$refProperty(item)) {
        return item
      } else {
        return Object.assign({}, {
          name: item.name,
          description: item.description
        }, handleSwaggerSchema(item, _execCount + 1))
      }
    })

    return {
      ...refObjNoProperties,
      params
    }
  }
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
function swaggerObjectToArray (obj) {
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

export default {
  components: {
    Success
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      apisData: [],
      importSuccess: false,
      methods: ['get', 'post', 'put', 'delete']
    }
  },
  methods: {
    visibleChange (val) {
      this.importSuccess = val
    },
    /**
     * 从用户上传的文件中提取数据并构建apis, 该文件之中保存的必须是标准的JSON对象字符串
     * <http://www.json.org/json-zh.html>
     * @param  {[type]} file js file对象
     * @return {[type]}      [description]
     */
    importJsonFromSwagger (file) {
      const oReq = new XMLHttpRequest()
      oReq.onload = (e) => {
        try {
          const json = JSON.parse(e.target.responseText)
          this.buildApisFormJson(json)
        } catch (err) {
          window.console.log(err)
          this.$message.error('json格式错误')
        }
      }
      oReq.open('get', file.url, true)
      oReq.send()
      this.$refs.importSwaggerJson.clearFiles()
    },
    buildReqParams (params, parameterList, methodType) {
      if (methodType === 'get') {
        const newParams = this.buildParams(parameterList)
        params.query = newParams
      } else {
        const queryParams = parameterList.filter(item => item.in === 'query')
        const pathParams = parameterList.filter(item => item.in === 'path')
        const bodyParams = parameterList.filter(item => item.in === 'body')

        const buildedQueryParams = this.buildParams(queryParams)
        const buildedPathParams = this.buildParams(pathParams)
        const buildedBodyParams = this.buildParams(bodyParams.map(item => handleSwaggerSchema(item.schema)))

        params.query = buildedQueryParams
        params.path = buildedPathParams
        params.body = buildedBodyParams
      }
      return params
    },
    /**
     * 构建所有响应的响应体, 循环该接口应该有的响应状态数组
     * @param  {Array} responseList 响应数组
     * @return {[type]}             构建出来的响应体数组
     */
    buildResponse (responseList) {
      const statusArray = []

      for (let [statusCode, content] of Object.entries(responseList)) {
        let params = []
        if (content.schema) { // 如果该响应有响应体
          const handledSchema = handleSwaggerSchema(content.schema)
          const getedParams = handledSchema.params || (handledSchema.result && handledSchema.result.params)

          if (getedParams) {
            params = this.buildParams(getedParams)
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
    },
    /**
     * 构建响应或请求的参数列表
     * @param  {array} parameterList 参数数组
     * @return {array}               构建出来的参数数组
     */
    buildParams (parameterList) {
      return parameterList.map(item => {
        var param = {
          key: item.name,
          type: getSwaggerType(item.type),
          required: !!item.required,
          example: item.default,
          comment: item.description
        }

        if (param.type === 'object' && item.params) {
          param.params = this.buildParams(item.params)
        } else {
          param.params = []
        }

        if (param.type.indexOf('array') >= 0) {
          param.items = {
            type: item.items && getSwaggerType(item.items.type),
            params: item.items && item.items.type === 'object' && this.buildParams(item.items.params)
          }
          param.type = 'array'
        }

        return param
      })
    },
    /**
     * 从swagger json配置文件中构建apis
     * @param  {json} json json对象
     * @return {[type]}     构建完成之后组件弹窗
     */
    buildApisFormJson (json) {
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
      _definitions = json.definitions || {}

      let { title = '' } = info

      const swaggerApis = []

      for (let [key, value] of Object.entries(paths)) {
        try {
          for (let method in value) {
            const methodValue = value[method]
            const { summary } = methodValue
            const api = Api()

            api.prodUrl = key
            api.name = `${title}-${summary}`
            api.desc = summary
            api.group = this.group._id
            api.options.method = method
            api.options.params = this.buildReqParams(api.options.params, methodValue.parameters || [], method)
            api.options.response = this.buildResponse(methodValue.responses)

            swaggerApis.push(api)
          }
        } catch (e) {
          console.log(`${key} API 有误 无法解析`)
          console.warn(e)
        }
      }

      console.log(swaggerApis)

      console.log(info, paths, _definitions, title)

      this.importSuccess = true
      this.apisData[0] = {
        groupName: this.group.name,
        groupId: this.group._id,
        apis: swaggerApis
      }
    }
  }
}
</script>
