<template>
  <div class="body">
    <el-button @click="showSwaggerModel">
      <i class="el-icon-upload2"></i>导入API
    </el-button>
    <success v-if="importSuccess" :visible="importSuccess" :import-type="importType" :apis-data="apisData"
             @visibleChange="visibleChange" @refresh="refresh" />
    <ConfigModel v-if="showConfigModel" :showConfigModel.sync="showConfigModel" @submit="submit" />
  </div>
</template>

<script>
import Success from './Success'
import ConfigModel from './ConfigModel'
import { mapActions } from 'vuex'
import { Loading } from 'element-ui'
import buildApisFormApiMockerDoc from '@/util/importApiMockerDoc'
import buildApisFormSwagger from '@/util/importSwagger'
import buildApisFormRap from '@/util/importRap'
import buildApisFormHar from '@/util/importHar'
import buildApisFormYapiJson from '@/util/importYapiJson'
import buildApisFormEasyMockHtml from '@/util/importEasyMockHtml'

const analysisList = [
  buildApisFormSwagger, buildApisFormApiMockerDoc, buildApisFormRap,
  buildApisFormHar, buildApisFormEasyMockHtml, buildApisFormYapiJson
]

export default {
  components: { Success, ConfigModel },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showConfigModel: false,
      apisData: [],
      importSuccess: false,
      methods: ['get', 'post', 'put', 'delete'],
      importType: 0,
      devUrl: '',
      prodUrl: ''
    }
  },
  methods: {
    ...mapActions(['importApi']),
    showSwaggerModel () {
      this.showConfigModel = true
    },
    refresh () {
      this.showConfigModel = false
      this.$emit('refresh')
    },
    submit (param) {
      let {importCategory, importType} = param
      this.importType = importType
      this.apisData = []
      if (importCategory === 0) {
        this.fileImport(param)
      } else {
        this.urlImport(param)
      }
    },
    fileImport (param) {
      let loadingInstance = Loading.service({text: '获取数据中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'})
      let {fileList, importSource, devUrl, prodUrl} = param
      let promiseList = fileList.map((file, index) => this.importJsonFromFile(file, index, {importSource, devUrl, prodUrl}))
      Promise.all(promiseList).then((result) => {
        loadingInstance.close()
        this.importSuccess = true
      }).catch((error) => {
        loadingInstance.close()
        console.log(error)      // 失败了，打出 '失败'
      })
    },
    urlImport (param) {
      let loadingInstance = Loading.service({text: '获取数据中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'})
      let {group} = this
      let {_id, name} = group
      let {importSource, devUrl, prodUrl} = param
      let analysisMethod = analysisList[importSource]

      this.importApi({...param, groupId: _id}).then((res) => {
        try {
          this.apisData[0] = {
            groupName: name,
            groupId: _id,
            apis: analysisMethod(res.data, group, {devUrl, prodUrl})
          }
          this.importSuccess = true
        } catch (err) {
          window.console.log(err)
          this.$message.error('解析数据失败')
        }
        loadingInstance.close()
      }).catch(() => {
        loadingInstance.close()
        this.$message.error('获取数据失败')
      })
    },
    visibleChange (val) {
      this.importSuccess = val
    },
    /**
     * 从用户上传的文件中提取数据并构建apis, 该文件之中保存的必须是标准的JSON对象字符串
     * <http://www.json.org/json-zh.html>
     * @param  {[type]} file js file对象
     * @return {[type]}      [description]
     */
    importJsonFromFile (file, index, param) {
      let {importSource} = param
      let analysisMethod = analysisList[importSource]

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file.raw)
        reader.onload = e => {
          let { result } = e.target
          try {
            const json = importSource === 4 ? result : JSON.parse(result)
            this.apisData[index] = {
              groupName: file.name,
              groupId: this.group._id,
              apis: analysisMethod(json, this.group, param)
            }
            resolve()
          } catch (err) {
            window.console.log(err)
            this.$message.error('json格式错误')
            reject()
          }
        }
      })
    }
  }
}
</script>
