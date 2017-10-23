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
import ApiInit from '@/util/apiInitData'
import Success from './Success'

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
function isHas$refProperty (obj) {
  return obj.hasOwnProperty('$ref')
}
function handleSwaggerSchema (schema, definitions) {
  if (!isHas$refProperty(schema)) {
    if (schema.type !== 'object' || schema.type !== 'array') { // 如果只返回一个常量, 目前api-mocker无法支持 在外层包一层result
      return swaggerObjectToArray({
        result: {
          type: getSwaggerType(schema.type)
        }
      })
    }

    return schema
  } else {
    let ref = schema['$ref'].match(/.*\/(.*?)$/)[1]
    console.log(ref)
    schema = swaggerObjectToArray(definitions[ref].properties)

    console.log(schema)
    return schema
  }
}
// for response
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
      const newParams = this.buildParams(parameterList)
      if (methodType === 'get') {
        params.query = newParams
      } else {
        params.body = newParams
      }
      return params
    },
    buildResponse (parameterList, definitions) {
      const statusArray = []

      for (let [statusCode, content] of Object.entries(parameterList)) {
        let params = []
        if (content.schema) { // 如果该响应有响应体
          params = this.buildParams(handleSwaggerSchema(content.schema, definitions))
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
    buildParams (parameterList) {
      return parameterList.map(p => {
        const param = {
          key: p.name,
          type: getSwaggerType(p.type),
          required: true,
          comment: p.description,
          example: p.default
        }
        if (param.type === 'object' && p.properties) {
          param.params = this.buildParams(swaggerObjectToArray(p.properties))
        } else {
          param.params = []
        }
        if (param.type.indexOf('array') >= 0) {
          param.items = {
            type: param.type.replace('array<', '').replace('>', '')
          }
          param.params = this.buildParams([p.items])
          param.type = 'array'
        }
        return param
      })
    },
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
        paths = {},
        definitions = {}
      } = json || {}
      let { title = '' } = info

      const swaggerApis = []

      for (let [key, value] of Object.entries(paths)) {
        for (let method in value) {
          const methodValue = value[method]
          const { summary } = methodValue
          const api = new ApiInit()
          api.name = `${title}-${key}`
          api.desc = summary
          api.group = this.group._id
          api.options.method = method
          api.options.params = this.buildReqParams(api.options.params, methodValue.parameters || [], method)
          api.options.response = this.buildResponse(methodValue.responses, definitions)

          swaggerApis.push(api)
        }
      }

      console.log(swaggerApis)

      console.log(info, paths, definitions, title)

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
