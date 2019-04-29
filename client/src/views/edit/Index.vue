<template>
 <div class="content" :class="mode">
  <layout v-loading="loading">
    <template slot="nav">
      <h3 class="nav-title">基本信息</h3>
      <api-info></api-info>
      <h3 class="nav-title">历史记录</h3>
      <api-history></api-history>
    </template>
    <template slot="view">
      <api-box></api-box>
    </template>
  </layout>
 </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ApiInfo from './ApiInfo'
import ApiBox from './apiBox/Index'
import ApiHistory from './ApiHistory'

export default {
  components: {
    ApiInfo,
    ApiBox,
    ApiHistory
  },
  data () {
    return {
      loading: true
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
        this.$store.commit('doc/INIT_API', this.$route.query.groupId)
        this.endLoading()
      } else {
        this.getApi(this.$route.params).then(() => {
          this.endLoading()
        }).catch(err => {
          this.$message.error(`获取数据失败:${err.msg}`)
          this.endLoading()
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.initApi()
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.apiUnsaved) {
      this.$confirm('有未保存的内容, 是否离开?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {})
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
  margin: 0 15px 0 -8px;
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
