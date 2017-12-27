<template>
  <div class="content api-diff">
    <div class="left">
      <api :api="leftApi" :diff-mode="true"></api>
    </div>
    <div class="right">
      <api :api="rightApi" :diff-stack="diffStack" :diff-mode="true"></api>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import Api from './Api'
import jsonDiff from '@/util/jsonDiff'
export default {
  components: {
    Api
  },
  data: () => ({
    apis: [],
    leftApi: null,
    rightApi: null
  }),
  methods: {
    ...mapActions(['getApi', 'updateDiffStack', 'updateDiffMode']),
    buildApis (api) {
      // console.log(api)
      this.apis = api.history.records.map(r => R.clone(r.data))
      delete api.history
      // 历史原因：1.2.1版本之前，保存接口是把当前保存的接口推入历史记录
      // 所以判断此接口与上一次接口modifiedTime一致时，就没必要再使用它了
      if (this.apis.length && this.apis[0].modifiedTime !== api.modifiedTime) {
        this.apis.push(api)
      }
      this.apis.reverse()
      this.buildDiff(this.apis[0], this.apis[1])
    },
    buildDiff (rightApi, leftApi) {
      const { stack, value } = jsonDiff([rightApi, leftApi])
      this.rightApi = value
      this.leftApi = leftApi
      this.updateDiffStack(stack)
    }
  },
  computed: {
    ...mapState(['api', 'diffStack'])
  },
  created () {
    this.getApi(this.$route.params).then(() => this.buildApis(this.api))
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.updateDiffMode(true)
    })
  },
  beforeRouteLeave (to, from, next) {
    this.updateDiffMode(false)
    next()
  }
}
</script>
<style lang="less">
.api-diff {
  display: flex;
  overflow-y: scroll;
  & > div {
    flex: 1;
    width: 50%;
    border-right: 1px solid #eee;
  }
}
</style>
