<template>
<div>
  <el-upload action=""
       :auto-upload="false"
       :show-file-list="false"
       accept="application/json"
       ref="importRapJson"
       :on-change="importJsonFromRap">
    <i class="el-icon-upload2"></i>导入Rap Json
  </el-upload>
  <success v-if="importSuccess"
      :visible="importSuccess"
      :apis-data="apisData"
      @visibleChange="visibleChange"></success>
</div>
</template>

<script>
import ApiInit from '@/util/apiInitData'
import Success from './Success'
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
    importJsonFromRap (file) {
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
      this.$refs.importRapJson.clearFiles()
    },
    buildReqParams (params, parameterList, methodType) {
      methodType = Number(methodType)
      const newParams = this.buildParams(parameterList)
      if (methodType === 1) {
        params.query = newParams
      } else {
        params.body = newParams
      }
      return params
    },
    buildResponse (parameterList) {
      return [{
        status: 200,
        statusText: 'status1',
        example: null,
        params: this.buildParams(parameterList)
      }]
    },
    buildParams (parameterList) {
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
          param.params = this.buildParams(p.parameterList)
        }
        if (param.type.indexOf('array') >= 0) {
          param.items = {
            type: param.type.replace('array<', '').replace('>', '')
          }
          param.params = this.buildParams(p.parameterList)
          param.type = 'array'
        }
        return param
      })
    },
    buildApisFormJson (json) {
      let moduleList = []
      if (json.modelJSON) {
        moduleList = JSON.parse(json.modelJSON).moduleList
      } else if (json.projectData) {
        moduleList = json.projectData.moduleList
      } else {
        this.$message.error('json格式错误')
        return
      }
      const apis = []
      moduleList.forEach(module => {
        module.pageList.forEach(page => {
          page.actionList.forEach(action => {
            window.console.log(action)
            const apiName = `${module.name}-${page.name}-${action.name}`
            const api = new ApiInit()
            api.name = apiName
            api.desc = action.description
            api.prodUrl = action.requestUrl
            api.group = this.group._id
            const requestType = Number(action.requestType)
            api.options.method = this.methods[requestType - 1]
            api.options.params = this.buildReqParams(api.options.params, action.requestParameterList, requestType)
            api.options.response = this.buildResponse(action.responseParameterList)
            apis.push(api)
          })
        })
      })
      this.importSuccess = true
      this.apisData[0] = {
        groupName: this.group.name,
        groupId: this.group._id,
        apis
      }
    }
  }
}
</script>
<style>
</style>
