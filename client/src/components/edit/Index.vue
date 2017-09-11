<template>
 <div class="content" :class="mode">
  <el-row type="flex" class="list-content" v-if="!loading && !loadingFail">
    <api-info></api-info>
    <api-box></api-box>
  </el-row>
  <div class="loading" v-show="loading">
    <div class="el-loading-mask"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><!----></div></div>
  </div>
 </div>
</template>

<script>
import ApiInfo from './apiInfo/Index'
import ApiBox from './apiBox/Index'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    ApiInfo,
    ApiBox
  },
  data () {
    return {
      loading: true,
      loadingFail: false
    }
  },
  methods: {
    ...mapActions([
      'getApi'
    ]),
    beginLoading () {
      this.loading = true
    },
    endLoading () {
      this.loading = false
    },
    initApi () {
      this.$store.commit('CHANGE_MODE', 'edit')
      this.$store.commit('UPDATE_RESPONSE', {})
      this.beginLoading()
      if (this.$route.name === 'Create') {
        this.$store.commit('INIT_API', this.$route.query.groupId)
        this.endLoading()
      } else {
        this.getApi(this.$route.params).then(() => {
          this.endLoading()
        }).catch(err => {
          this.$message.error(`获取数据失败:${err.msg}`)
          this.loadingFail = true
          this.endLoading()
        })
      }
    }
  },
  computed: mapState(['api', 'mode', 'apiUnsaved']),
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
</style>
