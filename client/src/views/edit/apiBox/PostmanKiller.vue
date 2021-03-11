<template>
  <el-dialog
    title="自定义URL调用"
    :visible.sync="visible"
    :before-close="handleClose"
    width="800px">
    <div class="container" v-loading="loading">
        <h3>输入自定义URL，点击发送或回车</h3><br>
        会以当前mock API的请求方法、请求头、请求参数发送到该URL（可用于本地调试、导入响应数据等）
          <div style="display: flex; align-items: baseline; margin-bottom: 20px;">
            <el-input @keydown.native.enter="sendLocalTest" ref="input" auto-complete="off" v-model="localDebugUrl" placeholder="请填写URL地址"></el-input>
            <el-button style="margin-top: 15px; margin-left: 10px; width: 90px;" type="primary" @click="sendLocalTest">发 送</el-button>
          </div>
          <h4>响应数据</h4>
          <result-box style="margin-top: 10px;" :fullscreen="false" :dataFromLocal="true" res-active="all" :data="data"></result-box>
          <div style="text-align: right; margin-top: 10px;">
            <el-button style="margin-top: 30px;" :disabled="!data" type="primary" @click="copy">复制响应文本</el-button>
            <el-button style="margin-top: 30px;" :disabled="!data" type="primary" @click="copyToResponse">导入到mock响应</el-button>
            </div>
    </div>
    
  </el-dialog>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import ResultBox from '@/views/edit/apiBox/ResultBox'
import R from 'ramda'
import { buildSchemaFromExample } from '@/util'

export default {
  components: {
    ResultBox
  },
  props: {
    visible: Boolean
  },
  data () {
    return {
      localDebugUrl: '',
      data: null,
      loading: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    }
  },
  computed: {
    ...mapState('doc', ['api'])
  },
  methods: {
    ...mapActions(['localDebugApi']),
    handleClose () {
      this.$emit('update:visible', false)
      // this.data = null
      // this.localDebugUrl = ''
    },
    handleConfirm () {
      this.$emit('update:visible', false)
    },
    copy () {
      const input = document.createElement('textarea')
      input.innerHTML = JSON.stringify(this.data, null, '\t')
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message({
        type: 'success',
        message: '复制成功',
        duration: 1000
      })
      setTimeout(() => {
        this.$emit('update:visible', false)
      }, 500)
    },
    copyToResponse () {
      const copyResponse = {}
      const { status } = this.$store.state.doc.customProxyResponse
      const api = R.clone(this.api)
      copyResponse.status = status
      copyResponse.statusText = '自定义调用'
      copyResponse.example = this.data
      const schema = buildSchemaFromExample(this.data, [], '', status)
      copyResponse.params = schema.params
      if (!this.api.options.response[0].example) {
        api.options.response = [copyResponse]
      } else {
        api.options.response = [...this.api.options.response, copyResponse]
      }
      this.$store.commit('doc/UPDATE_API', api)
      this.$message({
        type: 'success',
        message: '导入成功',
        duration: 1000
      })
      this.$store.commit('doc/SET_API_CHANGED')
      setTimeout(() => {
        this.$emit('update:visible', false)
      }, 500)
    },
    sendLocalTest () {
      if (!this.localDebugUrl) {
        this.$message.warning('请填写接口地址')
        return
      }
      if (!this.validateProxyUrl(this.localDebugUrl)) {
        this.$message.warning('URL异常，请重新填写')
        return
      }
      this.loading = true
      this.localDebugApi(this.localDebugUrl).then(() => {
        this.data = this.$store.state.doc.customProxyResponseData
      }).finally(() => {
        this.loading = false
      })
    },
    validateProxyUrl (url) {
      if (/(127.0.0.1)|(0.0.0.0)|(localhost)/.test(url)) return false
      return true
    }
  }
}

</script>

<style scoped>
  .container {
    padding: 30px;
    padding-top: 0px;
  }
</style>
