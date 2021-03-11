<template>
 <div class="content">
  <layout v-loading="loading">
    <template slot="nav">
      <h3 class="nav-title">基本信息</h3>
      <api-info></api-info>
      <h3 class="nav-title">接口作者</h3>
      <api-author></api-author>
      <h3 class="nav-title">历史记录</h3>
      <api-history></api-history>
    </template>
    <template slot="view">
      <api-box></api-box>
    </template>
  </layout>
  <el-dialog
  title="温馨提示"
  :visible.sync="dialogVisible"
  :close-on-click-modal="false"
  :show-close="false"
  width="450px">
  <i class="el-icon-warning warning"></i><span>有未保存的内容, 是否离开?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ApiInfo from './ApiInfo'
import ApiBox from './apiBox/Index'
import ApiHistory from './ApiHistory'
import ApiAuthor from './ApiAuthor'
// import R from 'ramda'

export default {
  components: {
    ApiInfo,
    ApiBox,
    ApiHistory,
    ApiAuthor
  },
  data () {
    return {
      dialogVisible: false,
      loading: true,
      curResolve: null,
      curReject: null
    }
  },
  computed: {
    ...mapState('doc', ['api', 'mode', 'apiUnsaved'])
  },
  methods: {
    ...mapActions('doc', ['getApi']),
    beginLoading () {
      this.loading = true
    },
    endLoading () {
      this.loading = false
    },
    initApi () {
      this.$store.commit('doc/CHANGE_MODE', 'edit')
      this.$store.commit('doc/UPDATE_RESPONSE', {})
      this.beginLoading()
      if (this.$route.name === 'Create') {
        const copyApi = this.$route.params
        if (copyApi && Object.keys(copyApi).length > 0) {
          this.$store.commit('doc/UPDATE_API', copyApi)
          this.$store.commit('doc/SET_API_CHANGED')
        } else {
          this.$store.commit('doc/INIT_API', this.$route.query.groupId)
        }
        this.endLoading()
      } else {
        this.$store.commit('doc/UPDATE_API_PROPS', ['options.method', ''])
        this.getApi(this.$route.params).then(() => {
          this.endLoading()
        }).catch(err => {
          this.$message.error(`获取数据失败:${err.msg}`)
          this.endLoading()
        })
      }
    },
    handleConfirm () {
      this.curResolve()
    },
    handleClose () {
      this.curReject()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.initApi()
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.apiUnsaved) {
      this.dialogVisible = true
      new Promise((resolve, reject) => {
        this.curResolve = resolve
        this.curReject = reject
      }).then(() => {
        this.$store.commit('doc/SET_API_CHANGED', false)
        next()
      }).catch(() => {
        next(false)
      }).finally(() => {
        this.dialogVisible = false
      })
    } else {
      next()
    }
  }
}
</script>

<style>
.mocker-tip {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
  margin: -2px 2px 0 -6px;
  background: #97a8be;
  color: #fff;
}

.nav-title {
  font-size: 16px;
  color: #606266;
  line-height: 1.5em;
  padding: 15px;
}
</style>

<style scoped>
.warning {
  font-size: 30px;
  color: #e6a23c;
  vertical-align: -5px;
  margin-right: 10px;
}
</style>
